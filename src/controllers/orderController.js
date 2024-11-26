const mongoose = require("mongoose")

const Product = require("../models/productModel")
const Order = require("../models/orderModel")

const createOrder = async (req, res) => {
    try {
        const { itens } = req.body
        // let total = 0

        if (!itens || itens.length === 0) {
            res.status(400).json({ success: false, message: "Itens are required" });
        }

        for (const item of itens) {
            const product = await Product.findById(item.productId);
            // total += product.price

            if (!product) {
              res.status(404).json({ success: false, message: 'Product not found ' + item.productId });
            }
        }

        // Verifica se já existe algum para saber se é necessario criar um novo ou não
        const existOrder = await Order.findOne()
        
        if (existOrder == null) {
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                itens
                // total,
            })

            const newOrder = await order.save()
            res.status(201).json({ success: true, data: newOrder})
        } else {
            for (const newItem of itens) {
                const existingItem = existOrder.itens.find(
                    (item) => item.productId.toString() === newItem.productId
                );
                // se o produto já existir no carrinho, invés de criar um novo adicionar no estoque
                if (existingItem) {
                    existingItem.quantity += newItem.quantity;
                } else {
                    existOrder.itens.push(newItem);
                }
            }
            await existOrder.save();
            return res.status(200).json({ success: true, message: "Items added to existing order", data: existOrder });
        }
        
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()

        if (orders.length == 0) {
            res.status(404).json({ sucess: false, message: "Cart is empty" })
        }

        const response = {
            _id: orders[0]._id,
            count: orders[0].itens.length,
            itens: orders[0].itens
        }
        res.status(200).json({ success: true, ...response }) 
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }

}

const deleteProductFromOrder = async (req, res) => {
    try {
        const id = req.query.productId
        
        const order = await Order.findOne();

        if (!order) {
            res.status(404).json({ success: false, message: "Order not found" });
        }

        // Filtra os itens, removendo o produto com o productId especificado
        const initialLength = order.itens.length;
        order.itens = order.itens.filter(
            (item) => item.productId.toString() !== id
        );

        // Verifica se o produto foi encontrado e removido
        if (order.itens.length === initialLength) {
            res.status(404).json({ success: false, message: "Product not found in order" });
        }

        // Salva a ordem atualizada
        await order.save();

        res.status(200).json({ success: true, message: "Product removed from order", data: order,
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const deleteAllOrders = async (req, res) => {
    try {
        await Order.deleteMany()
        res.status(200).json({ success: true, message: 'All orders have been deleted'})
    } catch ( error ) {
        res.status(400).json({ success: false, message: error.message })
    }
}

const checkOrder = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const orderId = req.query.orderId

        if (!orderId) {
            return res.status(400).json({ success: false, message: "orderId is required"})
        }

        const order = await Order.findById(orderId).session(session)

        if (!order) {
            await session.abortTransaction()
            session.endSession()
            return res.status(404).json({ sucess: false, message: "Order not found" })
        }

        const {itens} = order

        if (!itens || itens.length === 0) {
            await session.abortTransaction()
            session.endSession();
            return res.status(400).json({ success: false, message: "Order has no itens"})
        }

        for ( const item of itens ) {
            const product = await Product.findById(item.productId).session()

            if(!product) {
                await session.abortTransaction()
                session.endSession()
                return res.status(400).json({ success: false, message: "Product not found " + item.productId })
            }
            // vendo se o estoque é menor do que a quantidade da compra
            if(product.stock < item.quantity) {
                await session.abortTransaction()
                session.endSession()
                return res.status(400).json({ success: false, message: "Insufficient stock for product: " + product.name })
            }
        }

        // Atualização do estoque
        for (const item of itens) {                       // decrementa o estoque
            await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } }, { new: true, session })
        }

        // esvazia o "carrinho" depois da efetuação
        await Order.deleteMany().session(session);


        await session.commitTransaction()
        session.endSession()

        return res.status(200).json({ success: true, message: "Order finalized successfully", data: order})
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, message: error.message })
    }
}

module.exports = { createOrder, getOrders, deleteProductFromOrder, deleteAllOrders, checkOrder }