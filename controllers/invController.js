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
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
        classificationSelect,
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

// building a JSon for the inventory to be used in the router
/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    }   else {
        
        next(new Error("No data returned"))
    }
}

//building the edit vehicle view
invCont.buildEditView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehicleByInvId(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("inventory/edit-inventory", {
        title: `Edit ${itemName}`,
        nav,
        classificationSelect,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model:itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
        

    })

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

// Update Inventory Data
invCont.updateInventory = async function (req, res) {

    let nav = await utilities.getNav()
  

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
        classification_id,
        inv_id
    } = req.body

    try {

      const updateResult = await invModel.updateInventory(
        inv_id,
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

      if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/")
      } else {
        const classificationList = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.render("inventory/add-inventory", {

            title: "Edit" + itemName,
            nav,
            classificationList: classificationList,
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
            classification_id,
            inv_id
        })
      }
    } catch (err) {
        const classificationList = await utilities.buildClassificationList(classification_id)
        console.error(err)
        res.status(500).render("inventory/edit-inventory", {

            title: "Update  Vehicle",
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
            classification_id,
            inv_id
        })
    }
}



// Build Delete View

invCont.buildDeleteView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehicleByInvId(inv_id)
    
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("inventory/delete-confirmation", {
        title: `Delete ${itemName}`,
        nav,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model:itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_price: itemData.inv_price,
    })

}

// Delete Inventory Data
invCont.deleteInventory = async function (req, res) {

    let nav = await utilities.getNav()
    const inv_id = parseInt(req.body.inv_id)
    const dataArray = await invModel.getVehicleByInvId(inv_id)
    const dataDetails = dataArray
  
    const itemName = dataDetails.inv_make + " " + dataDetails.inv_model

    try {
        const deleteResult = await invModel.deleteInventory(inv_id)


     
        if (deleteResult) {

          req.flash("notice", `The ${itemName} was successfully deleted.`)
          res.redirect("/inv/")
        } else {
        

          req.flash("notice", "Sorry, the delete failed.")
          res.render("inventory/delete-confirmation", {

              title: "Delete" + itemName,
              nav,
              errors: null,
              inv_id: dataDetails.inv_id,
              inv_make: dataDetails.inv_make,
              inv_model: dataDetails.inv_model,
              inv_year: dataDetails.inv_year,
              inv_price: dataDetails.inv_price,
            
          })
        }
    }   catch (err) {
          console.error(err)
          res.status(500).render("inventory/delete-confirmation", {

              title: "Delete  Vehicle",
              nav,
              errors: [{ msg: "Database error. Please try again." }],
              inv_id: dataDetails.inv_id,
              inv_make: dataDetails.inv_make,
              inv_model: dataDetails.inv_model,
              inv_year: dataDetails.inv_year,
              inv_price: dataDetails.inv_price,
          })
    }
}





module.exports = invCont