const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .isAlphanumeric().withMessage("No spaces or special characters allowed")
            .notEmpty().withMessage("Please provide a classification name.")
    ]
}
    
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {

        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name // to repopulate the form if the page reloads
        })
        return
    }
    next()
}

// Add inventory validation rules
validate.inventoryRules = () => {
    return [
        
        body("classification_id")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please choose a car classification"),

        body("inv_make")
            .trim()
            .escape()
            .isLength({ min: 1 })
            .withMessage("Please provide a make."),

        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a model."),
        
        body("inv_year")
            .trim()
            .escape()
            .isInt({ min: 1900, max: 2099})
            .withMessage("Year must be between 1900 and 2099"),

        body("inv_description")
            .trim()
            .isLength({ min: 1})
            .notEmpty()
            .withMessage("Please privide a description for the car"),

        body("inv_price")
            .trim()
            .isFloat({ min: 0 })
            .withMessage("Price must be a positive number."),

        body("inv_miles")
            .trim()
            .isFloat({ min: 0 })
            .withMessage("Miles must be 0 or greater."),

        
        body("inv_image")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Image path is required."),

        body("inv_thumbnail")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Thumbnail path is required."),

        body("inv_color")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Color is required."),


        
    ]
}

// Check inventory data and return errors or continue to add inventory
validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    // Extract the validation errors from a request.
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(req.body.classification_id)
        
        res.render("inventory/add-inventory", {
            title: "Add Vehicle",
            nav,
            classificationList,
            errors: errors.array(),
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,

        
        })
        return
    }
    next()
    
}


// Check Update data and return errors and redirect to the edit view
validate.checkUpdateData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id} = req.body
    // Extract the validation errors from a request.
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(req.body.classification_id)
        
        res.render("inventory/edit-inventory", {
            title: "Edit"+ itemName,
            nav,
            classificationList,
            errors: errors.array(),
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            inv_id,

        
        })
        return
    }
    next()
    
}

module.exports = validate