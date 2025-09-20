// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const errorController = require("../controllers/errController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// route to build the car details page
router.get("/detail/:inv_id", invController.buildInvId);

// fake or intentional error route to test 
router.get("/error", errorController.triggerError);
module.exports = router;
