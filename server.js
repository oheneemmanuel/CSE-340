/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
// inventory route
const inventoryRoute = require("./routes/inventoryRoute")
/* adding a baseController to interact with the database*/
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/")
// added for account route
const accountRoute = require("./routes/accountRoute")
//management route


// added for session management
const session = require("express-session")
const pool = require('./database/')

// adding for body parsing
const bodyParser = require("body-parser")


app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware for the session
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Body Parser Middleware for the form submit 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))  // for parsing application/x-www-form-urlencoded








/* ***********************
 * View Engine and template
 *************************/


app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at view root 
/*app.use(static)*/
/* ***********************
 * Routes
 *************************/
app.use(static)
/* inventory route */
app.use("/inv", inventoryRoute)



// account route
app.use("/account", accountRoute)

// route section to deliver the home view
app.get("/", utilities.handleErrors(baseController.buildHome))

// intentional error route for testing
app.get("/error", utilities.handleErrors(require("./controllers/errController").triggerError))

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {

  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'oh no, There was a crush. Maybe try a different route ?'} 
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})





/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
