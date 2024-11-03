const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authController = require("../controllers/auth.controller");

router.post("/", 
    authController.authhenticate, 
    cartController.createCart
);

router.get("/", 
    authController.authhenticate, 
    cartController.getCart
);

router.get("/count", 
    authController.authhenticate, 
    cartController.getCartCount
);

router.delete("/:itemId", 
    authController.authhenticate, 
    cartController.deleteCartItem
);

router.put("/:itemId", 
    authController.authhenticate, 
    cartController.updateCartItem
);

module.exports = router;