const Order = require("../models/Order");
const productController = require("./product.controller");
const { randomStringGenerator } = require("../utils/randomStringGenerator");

const orderController = {};

orderController.createOrder = async (req, res) => {
    try {
        const { userId } = req;
        const { shipto, contact, orderList, totalPrice } = req.body;

        const insufficientStockItems = await productController.checkItemStock(orderList);
        
        if (insufficientStockItems.length > 0) {
            const errorMessage = insufficientStockItems.reduce((total, item) => (total += item.message), "");
            throw new Error(errorMessage);
        }

        const order = new Order({ 
            userId, 
            shipto, 
            contact, 
            items: orderList, 
            totalPrice,
            orderNum: randomStringGenerator()
        });
        await order.save();

        console.log("order : ", order);

        res.status(200).json({
            status: "ok",
            orderNum: order.orderNum,
        });
    } catch (err) {
        res.status(400).json({
            status: "error",
            message: err.message,
        });
    }
}

module.exports = orderController;