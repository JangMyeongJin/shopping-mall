const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    items:[{
        productId: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
        size: {type: String, required: true},
        qty: {type: Number, default: 1}
    }]
},{
    timestamps: true
});

cartSchema.methods.toJSON = function() {
    const obj = this._doc;
    delete obj.__v;
    delete obj.createdAt;
    delete obj.updatedAt;
    return obj;
}

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;