const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        quantity: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  

  module.exports = mongoose.model('Order', orderSchema)
  