const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authController = require("../controllers/auth.controller");

router.post("/",
    authController.authhenticate,
    authController.checkAdminPermission,
    productController.createProduct
);

module.exports = router;