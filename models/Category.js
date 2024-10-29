const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true}
},{
    timestamps: true
});

categorySchema.methods.toJSON = function() {
    const obj = this._doc;
    delete obj.__v;
    delete obj.createdAt;
    delete obj.updatedAt;
    return obj;
};

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;


