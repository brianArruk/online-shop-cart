const express = require("express")
const { createOrder, getOrders, deleteProductFromOrder, deleteAllOrders, checkOrder } = require("../controllers/orderController")

const router = express.Router()

router.post("/createOrder", createOrder)
router.get("/getOrders", getOrders)
router.delete("/deleteProductFromOrder", deleteProductFromOrder)
router.delete("/deleteAllOrders", deleteAllOrders)
router.get("/checkOrder", checkOrder)

module.exports = router