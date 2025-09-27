const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {

    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    if (!data || data.length === 0) {
        req.flash("notice", "Sorry, no vehicles could be found.")  
        return res.render("inventory/classification", {
            title: "No vehicles found",
            nav,
            grid: "<p>Sorry, no vehicles could be found.</p>",
        })    
    }
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })

}

/* ****************************
*  Building the car details page for
    every car to display the details.

******/
invCont.buildInvId = async function (req, res, next) {
    const invId = req.params.inv_id
    const data = await invModel.getVehicleByInvId(invId)
    let nav = await utilities.getNav()
    const detail = utilities.buildDetailsView(data)
    res.render("inventory/details", {
        title: `${data.inv_make} ${data.inv_model} `,
        nav,
        vehicle: detail

    })
}

/**
 * Building the mangaement view
 * 
 */
invCont.buildManagement = async function (req, res, next) {
    const nav = await utilities.getNav()
    res.render("inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
    })
}

// display add classification view
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    })
}

// processing the add classification form
invCont.addClassification = async function (req, res) {
    let nav = await utilities.getNav()
    const { classification_name } = req.body
    const AddResult = await invModel.addClassification(classification_name)

    
    if (AddResult) {

        req.flash(

            "notice",
            "Congratulations, New classification added successfully."
        )
        res.status(201).render("inventory/management", {

            title: "Inventory Management",
            nav,
            errors: null,
        })
    }   else {

        req.flash("notice", "Sorry, adding the classification failed.")
        res.status(501).render("inventory/add-classification", {
          title: "Add Classification",
          nav,
          
          
        })
    }
}


//display add vehicle view
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        classificationList,
        errors: "",
        inv_make: "",
        inv_model:"",
        inv_year: "",
        inv_description: "",
        inv_price: "",
        inv_miles: "",
        inv_image: "/images/vehicles/no-image.png",
        inv_thumbnail: "/images/vehicles/no-image-tn.png",
        inv_color: "",
        classification_id: ""
        

    })

}

// Processing the add vehicle form
invCont.addInventory = async function (req, res) {

    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()

    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_image,
      inv_thumbnail,
      inv_color,
      classification_id
    } = req.body

    try {

      const newInv = await invModel.addInventory(
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        Math.round(inv_price),
        Math.round(inv_miles),
        inv_color,
        classification_id
      )

      if (newInv) {

        req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`)
        res.redirect("/inv/")
      } else {

        req.flash("notice", "Sorry, the insert failed.")
        res.render("inventory/add-inventory", {

            title: "Add Vehicle",
            nav,
            classificationList,
            errors: null,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_miles,
            inv_image,
            inv_thumbnail,
            inv_color,
            classification_id
        })
      }
    } catch (err) {

        console.error(err)
        res.status(500).render("inventory/add-inventory", {

            title: "Add Vehicle",
            nav,
            classificationList,
            errors: [{ msg: "Database error. Please try again." }],
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_miles,
            inv_image,
            inv_thumbnail,
            inv_color,
            classification_id
        })
    }
}


module.exports = invCont