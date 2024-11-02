const Cart = require("../models/Cart");

const cartController = {};

cartController.createCart = async (req, res) => {
    try {
        const {userId} = req;
        const { productId, size, qty } = req.body;

        let cart = await Cart.findOne({
            "userId": userId
        });

        if(!cart) {
            cart = new Cart({userId});
            await cart.save();
        }
        
        const cartItem = cart.items.find(
            (item) => item.productId.equals(productId) && item.size === size
        );

        if(cartItem) {
            // 수량 증가는 나중에 구현
            // cartItem.qty += qty;

            throw new Error("Item already exists");
        }
        console.log(productId, size, qty);
        cart.items = [...cart.items, {productId, size, qty}];

        await cart.save();

        res.status(200).json({
            status: "success",
            cart,
            cartItemQty: cart.items.length
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
}

module.exports = cartController;
