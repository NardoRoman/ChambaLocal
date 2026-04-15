const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Por favor agrega un nombre']
    },
    email: {
        type: String,
        required: [true, 'Por favor agrega un email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor agrega un email válido'
        ]
    },
    password: {
        type: String,
        required: [true, 'Por favor agrega una contraseña'],
        minlength: 6,
        select: false
    },
    // Location using GeoJSON
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere'
        }
    },
    // Campos específicos para cuando actúan como trabajadores
    skills: {
        type: [String],
        default: []
    },
    bio: {
        type: String,
        default: ''
    },
    verified: {
        type: Boolean,
        default: false
    },
    averageRating: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Encriptar password antes de guardar
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Coincidir passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
