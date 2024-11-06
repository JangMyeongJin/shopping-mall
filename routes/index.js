const express = require("express");
const router = express.Router();
const userApi = require("./user.api");
const productApi = require("./product.api");
const categoryApi = require("./category.api");
const cartApi = require("./cart.api");
const orderApi = require("./order.api");

router.use("/user", userApi);
router.use("/product", productApi);
router.use("/category", categoryApi);
router.use("/cart", cartApi);
router.use("/order", orderApi);
module.exports = router;
