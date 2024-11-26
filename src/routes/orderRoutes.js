const express = require("express")
const { createOrder, getOrders, deleteProductFromOrder, deleteAllOrders, checkOrder } = require("../controllers/orderController")
const authenticateJWT = require('../middlewares/authMiddlewares');

const router = express.Router()

router.post("/createOrder", authenticateJWT, createOrder)
router.get("/getOrders", authenticateJWT, getOrders)
router.delete("/deleteProductFromOrder", authenticateJWT, deleteProductFromOrder)
router.delete("/deleteAllOrders", authenticateJWT, deleteAllOrders)
router.get("/checkOrder", authenticateJWT, checkOrder)

module.exports = router