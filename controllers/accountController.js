const utilities = require('../utilities');
const accountModel = require('../models/account-model');
//password hashing module
const bcrypt = require('bcryptjs');

// 
const jwt = require('jsonwebtoken');
require('dotenv').config()


/*display login view */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    
    
  })
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}







/*display register view */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
    // Hash the password before storing
  let hashedPassword

  try {
    
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }



  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword  
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

async function accountManagement(req, res, next) {
  let nav = await utilities.getNav()
  try {
    req.flash("notice", "You are logged in.")
    res.status(200).render("account/account-management", {
      title: "Account Management",
      nav,
      errors: null,
    })
  } catch (error) {
    next(error)
  }

}

async function logout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out")
  res.redirect("/")
}

async function buildUpdate(req, res, next) {
  const nav = await utilities.getNav()
  try {

    const accountData = await accountModel.getAccountById(res.locals.accountData.account_id);
    res.render("account/update-account", {
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id: accountData.account_id,

      title: "Update Account",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error)
  }

}


// Update User  Data
async function updateAccount (req, res) {

    let nav = await utilities.getNav()

    const { account_firstname, account_lastname, account_email, account_id} = req.body
    try {

      const updateResult = await accountModel.updateAccount(

        account_firstname,
        account_lastname,
        account_email,
        parseInt(account_id)
       
      )
      if (updateResult) {
       
        req.flash("notice", `Account information was successfully updated.`)
        res.redirect("/account/")
      } else {
        
        req.flash("notice", "Sorry, the insert failed.")
        res.render("account/update-account", {
          title: "Update Account",
          nav,
          errors: null,
          account_firstname,
          account_lastname,
          account_email,
          account_id
        });
      }
    } catch (err) {
        console.error(err)
        res.status(500).render("account/update-account", {

            title: "Update Account",
            nav,
            errors: [{ msg: "Database error. Please try again." }],
            
        })
    }
}




async function updatePassword(req, res) {
  const nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const result = await accountModel.updatePassword(account_id, hashedPassword)

    if (result) {
      req.flash("notice", "Password updated successfully.")
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Password update failed.")
      return res.redirect("/account/update-account", {
        title: "Update Account",
        nav,
        errors: [{ msg: "Password update failed." }],
        account_id,
        account_firstname: res.locals.accountData.account_firstname,
        account_lastname: res.locals.accountData.account_lastname,
        account_email: res.locals.accountData.account_email,
      })
    }
  } catch (error) {
    console.error("Password update error:", error)
    res.status(500).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: [{ msg: "Database error. Please try again." }],
    })
  }
}





module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, accountManagement, logout, buildUpdate, updateAccount, updatePassword }