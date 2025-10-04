// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const errorController = require("../controllers/errController")
const utilities = require("../utilities")
const invValidator = require("../utilities/inventory-validator")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// route to build the car details page
router.get("/detail/:inv_id", invController.buildInvId);

// fake or intentional error route to test 
router.get("/error", errorController.triggerError);

// Route to build the management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagement)
)


// Route to build the add classification view
router.get("/add-classification", utilities.checkAccountType, utilities.checkLogin, utilities.handleErrors(invController.buildAddClassification));

//route to get the list of iventory when selected in the management view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

//Route to get get to the edit view of the inventory
router.get("/edit/:inv_id", utilities.checkAccountType, utilities.checkLogin, utilities.checkAccountType, utilities.checkLogin, utilities.handleErrors(invController.buildEditView));

//router to build the delete view
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteView));

// process the new classification
router.post(
  "/add-classification",
  invValidator.classificationRules(),
  invValidator.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)
//router to build the add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
// process the new inventory item
router.post(
  "/add-inventory",
  invValidator.inventoryRules(),
  invValidator.checkInventoryData,
  utilities.handleErrors(invController.addInventory) 
)

router.post(
  "/update",
  utilities.handleErrors(invController.updateInventory)

)
// A post router to handle the delete
router.post(
  "/delete/:inv_id",
  utilities.handleErrors(invController.deleteInventory)
)
//Routers to protect the account types from certain pages 



module.exports = router;
