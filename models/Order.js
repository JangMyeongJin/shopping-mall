const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    address: {type: String, required: true},
    phone: {type: String, required: true},
    totalPrice: {type: Number, required: true},
    status: {type: String, default: "preparing"},
    items:[{
        productId: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
        size: {type: String, required: true},
        qty: {type: Number, default: 1},
        price: {type: Number, required: true}   // 결재 당시 가격
    }]
},{
    timestamps: true
});

orderSchema.methods.toJSON = function() {
    const obj = this._doc;
    delete obj.__v;
    delete obj.createdAt;
    delete obj.updatedAt;
    return obj;
}

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;