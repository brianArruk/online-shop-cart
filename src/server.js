const http = require("http")
const app = require("./app")
const connectDB = require("./config/database")

const port = process.env.PORT || 3000

connectDB()

const server = http.createServer(app)
console.log("Server On!!")

server.listen(port)