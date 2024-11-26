const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Token is missing" });
    }

    const token = authHeader.split(' ')[1]; // Formato: "Bearer <token>"
    try {
        // Verifica a validade do token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Adiciona os dados do token ao objeto req
        next(); // Continua para o próximo middleware ou controlador
    } catch (error) {
        return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
};

module.exports = authenticateJWT;
