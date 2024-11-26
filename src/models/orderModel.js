const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    itens: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
        _id: false
      },
    ],
    total: { type: Number },
    createdAt: { type: Date, default: Date.now },
  });
  

  module.exports = mongoose.model('Order', orderSchema)
  