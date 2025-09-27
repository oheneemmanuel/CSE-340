//  Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
// form validation rules and check functions
const regValidate = require('../utilities/account-validation')
// GET route for 'My Account" for login
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//// GET route for 'My Account" for login
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.loginAccount),
    (req, res) => {
      res.status(200).send('login process')
    }
)
// Process the registration data
router.post(

    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
module.exports = router;