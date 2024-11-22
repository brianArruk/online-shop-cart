const express = require("express")
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct } = require("../controllers/productController")

const router = express.Router()

router.post("/createProduct", createProduct)
router.get("/getProduct", getProduct)
router.get("/getAllProducts", getAllProducts)
router.patch("/updateProduct", updateProduct)
router.delete("/deleteProduct", deleteProduct)

module.exports = router