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

// GET route for account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.accountManagement));

//Router to logout
router.get("/logout", utilities.handleErrors(accountController.logout));

//router to update the account information 
router.get("/update", utilities.handleErrors(accountController.buildUpdate))


// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin),
  
)
// Process the registration data
router.post(

    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
// process the update account 
router.post(
    "/update-account/",
    regValidate.updateRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)

    
    

)
// process the update passweord
router.post(
    "/update-password/",
    regValidate.passwordUpdateRules(),
    regValidate.checkPasswordUpdateData,
    utilities.handleErrors(accountController.updatePassword)
    

)
module.exports = router;