const express = require("express")
const productRoutes = require("../src/routes/productRoutes")
const orderRoutes = require("../src/routes/orderRoutes")

const morgan = require("morgan")
// const bodyParser = require("body-parser")
// const mongoose = require("mongoose")

const app = express()

app.use(morgan("dev"))
app.use(express.json());

app.use("/products", productRoutes);
app.use("/orders", orderRoutes)


module.exports = app