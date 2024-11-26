const express = require("express")
const productRoutes = require("../src/routes/productRoutes")
const orderRoutes = require("../src/routes/orderRoutes")
const authRoutes = require("../src/routes/authRoutes")
require('dotenv').config();

const morgan = require("morgan")

const app = express()

app.use(morgan("dev"))
app.use(express.json());

app.use("/products", productRoutes);
app.use("/orders", orderRoutes)
app.use("/token", authRoutes)


module.exports = app