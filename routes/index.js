const express = require("express");
const router = express.Router();
const userApi = require("./user.api");
const productApi = require("./product.api");
const categoryApi = require("./category.api");

router.use("/user", userApi);
router.use("/product", productApi);
router.use("/category", categoryApi);
module.exports = router;
