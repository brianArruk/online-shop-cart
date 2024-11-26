const express = require("express")
const { generateToken } = require('../controllers/authController');

const router = express.Router()

router.post("/generateToken", generateToken)

module.exports = router