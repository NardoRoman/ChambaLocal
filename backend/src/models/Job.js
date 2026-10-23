const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Por favor agrega un título al trabajo']
    },
    description: {
        type: String,
        required: [true, 'Por favor agrega una descripción']
    },
    category: {
        type: String,
        required: [true, 'Por favor provee una categoría']
    },
    employer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    worker: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Abierto', 'Asignado', 'En Progreso', 'Completado', 'Cancelado'],
        default: 'Abierto'
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
            index: '2dsphere',
            required: [true, 'Por favor provee coordenadas']
        }
    },
    budget: {
        type: Number
    },
    applicants: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        message: {
            type: String
        },
        status: {
            type: String,
            enum: ['Pendiente', 'Rechazado', 'Aceptado'],
            default: 'Pendiente'
        },
        appliedAt: {
            type: Date,
            default: Date.now
        }
    }],
    reviewed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
