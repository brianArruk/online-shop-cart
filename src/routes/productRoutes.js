const express = require("express")
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct } = require("../controllers/productController")
const authenticateJWT = require('../middlewares/authMiddlewares');

const router = express.Router()

router.post("/createProduct", authenticateJWT, createProduct)
router.get("/getProduct", authenticateJWT, getProduct)
router.get("/getAllProducts", authenticateJWT, getAllProducts)
router.patch("/updateProduct", authenticateJWT, updateProduct)
router.delete("/deleteProduct", authenticateJWT, deleteProduct)

module.exports = router