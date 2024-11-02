const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authController = require("../controllers/auth.controller");

router.post("/",
    authController.authhenticate,
    authController.checkAdminPermission,
    productController.createProduct
);

router.get("/",
    productController.getProducts
);

router.get("/:id",
    productController.getProductById
);

router.put("/:id",
    authController.authhenticate,
    authController.checkAdminPermission,
    productController.updateProduct
);

router.delete("/:id",
    authController.authhenticate,
    authController.checkAdminPermission,
    productController.deleteProduct
);

module.exports = router;