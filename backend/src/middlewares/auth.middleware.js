const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'No autorizado para acceder a esta ruta' });
    }

    try {
        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey_changemeinprod');

        req.user = await User.findById(decoded.id);
        
        // Obtenemos el rol desde el payload del token (elegido en login)
        req.userRole = decoded.role;

        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: 'No autorizado para acceder a esta ruta' });
    }
};

module.exports = { protect };
