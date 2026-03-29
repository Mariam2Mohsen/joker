const express = require("express")
const router = express.Router()

const adminController = require("../controller/adminController")



router.get("/pending-providers",adminController.getPendingProviders)

router.put("/approve-provider/:id",adminController.approveProvider)

router.put("/reject-provider/:id",adminController.rejectProvider)



router.get("/pending-services",adminController.getPendingServices)

router.put("/approve-service/:id",adminController.approveService)

router.put("/reject-service/:id",adminController.rejectService)

module.exports = router