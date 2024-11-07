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

productController.getProducts = async (req, res) => {
    try {
        const {page, name} = req.query;
        const cond = name ? {name: {$regex: name, $options: "i"}} : {};
        let response = {status: "ok"};

        let query = Product.find(cond);
        
        if(page) {
            query = query.skip((page - 1) * 10).limit(10);

            const total = await Product.find(cond).countDocuments();
            const totalPages = Math.ceil(total / 10);

            response.totalPageNum = totalPages;
        }

        const products = await query.exec();

        response.products = products;

        res.status(200).json(response);
        
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
}

productController.updateProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const {sku, name, image, size, category, description, price, stock} = req.body;

        const product = await Product.findByIdAndUpdate(
            {
                _id: id
            },
            {
                sku, name, image, size, category, description, price, stock
            },
            {
                new: true
            }
        );

        res.status(200).json({
            status: "ok",
            product
        });

    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
}

productController.deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;

        await Product.findByIdAndDelete(id);

        res.status(200).json({
            status: "ok"
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
}

productController.getProductById = async (req, res) => {
    try {
        const {id} = req.params;

        const product = await Product.findById(id);

        res.status(200).json({
            status: "ok",
            product
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
}

productController.checkStock = async (item) => {
    const product = await Product.findById(item.productId);
    if (product.stock[item.size] < item.qty) {
        return {isVerify: false, message: `${product.name} ${item.size} size is out of stock`};
    } else {
        const newStock = {...product.stock};
        newStock[item.size] -= item.qty;
        
        product.stock = newStock;

        return {isVerify: true, product};
    }
}

productController.checkItemStock = async (orderList) => {
    const result = [];
    let newProduct = [];

    // Promise.all 비동기 로직을 병렬로 처리
    await Promise.all(
        
        orderList.map(async (item) => {
            const checkStock = await productController.checkStock(item);
            if (!checkStock.isVerify) {
                result.push({item, message: checkStock.message});
            }else {
                newProduct.push(checkStock.product);
            }
        })
    );

    if(result.length > 0) {
        return result;
    }else {
        newProduct.map(async (product) => {
            await product.save();
        });
    }

    return newProduct;
}


module.exports = productController;