const express = require("express")
const productRoutes = require("../src/routes/productRoutes")
const cartRoutes = require("../src/routes/cartRoutes")
const authRoutes = require("../src/routes/authRoutes")
require('dotenv').config();

const morgan = require("morgan")

const app = express()

app.use(morgan("dev"))
app.use(express.json());

app.use("/products", productRoutes);
app.use("/cart", cartRoutes)
app.use("/token", authRoutes)


module.exports = app