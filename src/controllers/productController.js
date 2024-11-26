const mongoose = require("mongoose")

const Product = require("../models/productModel")

const createProduct = async (req, res) => {
    try {
        const { name, price, stock } = req.body;

        if (!name || !price || !stock) {
            return res.status(400).json({ success: false, message: "Name, price, and stock are required" });
        }

        const existingProduct = await Product.findOne({ name });

        // se o produto já existir, invés de criar um novo adicionar no estoque
        if (existingProduct) {
            existingProduct.stock += stock;
            const updatedProduct = await existingProduct.save();

            return res.status(200).json({ success: true, message: "Product stock updated successfully", data: updatedProduct });
        }

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

const getProduct = async (req, res) => {
    try {
        const id = req.query.productId

        const doc = await Product.findById(id).select('_id name price stock');
        if (doc) {
            res.status(200).json({ success: true, product: doc })
        } else {
            res.status(404).json({ message: "ID not found" });
        }
    } catch (error){
        res.status(400).json({ success: false, message: error.message })
    }
}

const getAllProducts = async (req, res) => {
    try {
        const docs = await Product.find().select('_id name price stock');

        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    stock: doc.stock
                }
            })
        }
        res.status(200).json({ success: true, response })
       
    } catch (error){
        res.status(400).json({ success: false, message: error.message })
    }
}

const updateProduct = async (req, res) => {
    try {
        const id = req.query.productId
        const findId = await Product.findById(id)

        if(findId) {
            const result = await Product.findByIdAndUpdate(id, { $set: req.body }, { new: true });
            res.status(200).json({ success: true, message: 'Product has been updated ' + result.id })
        } else {
            res.status(404).json({ message: 'ID not found' })
        }

    } catch (error){
        res.status(400).json({ success: false, message: error.message })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const id = req.query.productId
        const findId = await Product.findById(id)

        if(findId) {
            await Product.deleteOne({_id: id})
            res.status(200).json({ success: true, message: 'Product has been deleted ' + id })
        } else {
            res.status(404).json({ message: 'ID not found' })
        }
        
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

module.exports = { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct }