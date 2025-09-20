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

module.exports = invCont