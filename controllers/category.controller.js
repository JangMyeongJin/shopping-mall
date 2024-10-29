const Category = require("../models/Category");

const categoryController = {};

categoryController.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = new Category({ name });
        await category.save();

        res.status(200).json({
            status: "success",
            category,
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                status: "fail",
                message: "Category name already exists"
            });
        }
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
}

categoryController.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({
            status: "success",
            data: categories,
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
}

categoryController.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);

        res.status(200).json({
            status: "success",
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
}   

module.exports = categoryController;