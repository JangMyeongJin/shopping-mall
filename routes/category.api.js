const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const authController = require("../controllers/auth.controller");

router.post("/", 
    authController.authhenticate,
    authController.checkAdminPermission,
    categoryController.createCategory
);

router.get("/", 
    authController.authhenticate,
    authController.checkAdminPermission,
    categoryController.getCategories
);

router.delete("/:id", 
    authController.authhenticate,
    authController.checkAdminPermission,
    categoryController.deleteCategory
);

module.exports = router;