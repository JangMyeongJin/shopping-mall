const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authController = require("../controllers/auth.controller");

router.post("/", 
    authController.authhenticate, 
    orderController.createOrder
);

router.get("/", 
    authController.authhenticate, 
    orderController.getOrders
);

router.get("/admin", 
    authController.authhenticate,
    authController.checkAdminPermission,
    orderController.getAdminOrders
);

router.put("/:id", 
    authController.authhenticate,
    authController.checkAdminPermission,
    orderController.updateOrder
);

module.exports = router;