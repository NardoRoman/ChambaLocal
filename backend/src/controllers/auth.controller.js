const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper para enviar cookie/token
const sendTokenResponse = (user, role, statusCode, res) => {
    // Generar token con el rol activo de la sesión
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET || 'mysecretkey_changemeinprod', {
        expiresIn: '30d'
    });

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role, // role es dinámico según cómo loguea
            location: user.location,
            skills: user.skills,
            verified: user.verified,
            averageRating: user.averageRating
        }
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, longitude, latitude, skills } = req.body;

        // Crear usuario principal
        const userFields = {
            name,
            email,
            password
        };

        if (longitude && latitude) {
            userFields.location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            };
        }

        if (skills) {
            userFields.skills = skills;
        }

        const user = await User.create(userFields);

        // Envía el token considerando el rol elegido al registrarse
        sendTokenResponse(user, role || 'Trabajador', 200, res);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validar email e password
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Por favor provee un email y password' });
        }
        
        // Es necesario que indique con qué rol quiere ingresar
        if (!role) {
            return res.status(400).json({ success: false, error: 'Por favor especifica tu rol (Trabajador o Contratante)' });
        }

        // Buscar al usuario
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
        }

        // Chequear password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
        }

        sendTokenResponse(user, role, 200, res);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    // req.user has current user info, req.userRole has the session role
    res.status(200).json({
        success: true,
        data: {
            ...req.user._doc,
            role: req.userRole
        }
    });
};
