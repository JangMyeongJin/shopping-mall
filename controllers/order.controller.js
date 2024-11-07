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

orderController.getOrders = async (req, res) => {
    try {
        const { userId } = req;

        const orders = await Order.find({ userId });

        
        await Promise.all(orders.map(async (order) => {
            const newItems = [];
            order.items.map(async (item) => {
                const product = await productController.getProductById(item._id);
                console.log("item : ", item);
                console.log("product : ", product);
                const newItem = {
                    ...item,
                    productName: product.name,
                    productImg: product.image
                }
                console.log("newItem : ", newItem);
                newItems.push(newItem);
            });
            order.items = newItems;
        }));


        res.status(200).json({
            status: "ok",
            orders,
        });
    } catch (err) {
        res.status(400).json({
            status: "error",
            message: err.message,
        });
    }
}

orderController.getAdminOrders = async (req, res) => {
    try {
        const { page, ordernum } = req.query;
        const cond = ordernum ? {orderNum: {$regex: ordernum, $options: "i"}} : {};
        let response = {status: "ok"};

        let query = Order.find(cond);

        if(page) {
            query = query.skip((page - 1) * 3).limit(3);

            const total = await Order.find(cond).countDocuments();
            const totalPages = Math.ceil(total / 3);

            response.totalPageNum = totalPages;
        }

        const orders = await query.exec();

        response.orders = orders;

        res.status(200).json(response);

    } catch (err) {
        res.status(400).json({
            status: "error",
            message: err.message,
        });
    }
}

module.exports = orderController;