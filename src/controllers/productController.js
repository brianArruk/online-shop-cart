const mongoose = require("mongoose")

const Product = require("../models/productModel")

const createProduct = async (req, res) => {
    try {
        const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock
        })

        const newProduct = await product.save()

        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { createProduct }