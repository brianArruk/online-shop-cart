const mongoose = require("mongoose")

const Product = require("../models/productModel")
const Cart = require("../models/cartModel")

const addProductCart = async (req, res) => {
    try {
        const { itens } = req.body

        if (!itens || itens.length === 0) {
            return res.status(400).json({ success: false, message: "Itens are required" });
        }

        for (const item of itens) {
            const product = await Product.findById(item.productId);

            if (!product) {
              return res.status(404).json({ success: false, message: 'Product not found ' + item.productId });
            }
        }

        // Verifica se já existe algum produto no carrinho para saber se é necessario criar um novo ou não
        const existCart = await Cart.findOne()
        
        if (existCart == null) {
            const cart = new Cart({
                _id: new mongoose.Types.ObjectId(),
                itens
                // total,
            })

            const newCart = await cart.save()
            return res.status(201).json({ success: true, data: newCart})
        } else {
            for (const newItem of itens) {
                const existingItem = existCart.itens.find(
                    (item) => item.productId.toString() === newItem.productId
                );
                // se o produto já existir no carrinho, invés de criar um novo adicionar no estoque
                if (existingItem) {
                    existingItem.quantity += newItem.quantity;
                } else {
                    existCart.itens.push(newItem);
                }
            }
            await existCart.save();
            return res.status(200).json({ success: true, message: "Items added to existing cart", data: existCart });
        }
        
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
};

const getProductsCart = async (req, res) => {
    try {
        const cart = await Cart.find()

        if (cart.length == 0) {
            return res.status(404).json({ sucess: false, message: "Cart is empty" })
        }

        const response = {
            _id: cart[0]._id,
            count: cart[0].itens.length,
            itens: cart[0].itens
        }
        res.status(200).json({ success: true, ...response }) 
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }

}

const deleteProductFromCart = async (req, res) => {
    try {
        const id = req.query.productId
        
        const cart = await Cart.findOne();

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        // Filtra os itens, removendo o produto com o productId especificado
        const initialLength = cart.itens.length;
        cart.itens = cart.itens.filter(
            (item) => item.productId.toString() !== id
        );

        // Verifica se o produto foi encontrado e removido
        if (cart.itens.length === initialLength) {
            return res.status(404).json({ success: false, message: "Product not found in cart" });
        }

        // Salva a ordem atualizada
        await cart.save();

        res.status(200).json({ success: true, message: "Product removed from cart", data: cart,
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const deleteAllProductsCart = async (req, res) => {
    try {
        await Cart.deleteMany()
        res.status(200).json({ success: true, message: 'All products have been removed from the cart'})
    } catch ( error ) {
        res.status(400).json({ success: false, message: error.message })
    }
}

const purchaseCheck = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const cartId = req.query.cartId

        if (!cartId) {
            return res.status(400).json({ success: false, message: "cartId is required"})
        }

        const cart = await Cart.findById(cartId).session(session)

        if (!cart) {
            await session.abortTransaction()
            session.endSession()
            return res.status(404).json({ sucess: false, message: "Cart not found" })
        }

        const {itens} = cart

        if (!itens || itens.length === 0) {
            await session.abortTransaction()
            session.endSession();
            return res.status(400).json({ success: false, message: "Cart has no itens"})
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
        await Cart.deleteMany().session(session);


        await session.commitTransaction()
        session.endSession()

        res.status(200).json({ success: true, message: "Purchase completed successfully" })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ success: false, message: error.message })
    }
}

module.exports = { addProductCart, getProductsCart, deleteProductFromCart, deleteAllProductsCart, purchaseCheck }