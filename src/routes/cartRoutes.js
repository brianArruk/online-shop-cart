const express = require("express")
const { addProductCart, getProductsCart, deleteProductFromCart, deleteAllProductsCart, purchaseCheck } = require("../controllers/cartController")
const authenticateJWT = require('../middlewares/authMiddlewares');

const router = express.Router()

router.post("/addProductCart", authenticateJWT, addProductCart)
router.get("/getProductsCart", authenticateJWT, getProductsCart)
router.delete("/deleteProductFromCart", authenticateJWT, deleteProductFromCart)
router.delete("/deleteAllProductsCart", authenticateJWT, deleteAllProductsCart)
router.get("/purchaseCheck", authenticateJWT, purchaseCheck)

module.exports = router