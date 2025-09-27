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
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to build the add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
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
module.exports = router;
