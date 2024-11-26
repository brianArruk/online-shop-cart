const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');

const generateToken = (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({ success: false, message: 'username and password are required' });
        }

        // Extrai as credenciais codificadas em base64 do cabeçalho Authorization
        const encodedCredentials = authHeader.split(' ')[1]; // Remover "Basic " e pegar o valor base64
        const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf8'); // Decodifica em utf8

        // Extrai o username e password do formato "username:password"
        const [username, password] = decodedCredentials.split(':');

        // Verifica se o username e password são "teste"
        if (username !== 'admin' || password !== 'root') {
            return res.status(403).json({ success: false, message: 'Invalid Credentials' });
        }

        const token = jwt.sign(
            { id: "admin", role: "system" },
            JWT_SECRET,       
            { expiresIn: '1d' }
        );

        
        res.status(200).json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { generateToken };
