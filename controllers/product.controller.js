const Product = require("../models/Product");

const productController = {};

productController.createProduct = async (req, res) => {
    try {
        const { sku, name, image, category, description, price, stock } = req.body;

        const product = new Product({
            "sku": sku,
            "name": name,
            "image": image,
            "category": category,
            "description": description,
            "price": price,
            "stock": stock
        });

        await product.save();

        res.status(200).json({
            status: "ok",
            product
        });

    }catch(err) {
        // duplicate key 에러 처리
        if (err.code === 11000) {
            return res.status(400).json({
                status: "fail",
                message: "Sku number already exists"
            });
        }

        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
}

module.exports = productController;