const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');

const generateToken = (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({ success: false, message: 'username and password are required' });
        }

        const encodedCredentials = authHeader.split(' ')[1]; 
        const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf8'); 

        const [username, password] = decodedCredentials.split(':');
        
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
