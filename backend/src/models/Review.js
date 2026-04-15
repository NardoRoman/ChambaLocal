const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.ObjectId,
        ref: 'Job',
        required: true
    },
    reviewer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    reviewee: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Por favor provee un rating entre 1 y 5']
    },
    comment: {
        type: String,
        required: [true, 'Por favor agrega un comentario']
    }
}, {
    timestamps: true
});

// Calculate average rating after saving
reviewSchema.statics.getAverageRating = async function(userId) {
    const obj = await this.aggregate([
        {
            $match: { reviewee: userId }
        },
        {
            $group: {
                _id: '$reviewee',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        await this.model('User').findByIdAndUpdate(userId, {
            averageRating: obj[0] ? obj[0].averageRating : 0
        });
    } catch (err) {
        console.error(err);
    }
};

reviewSchema.post('save', function() {
    this.constructor.getAverageRating(this.reviewee);
});

reviewSchema.pre('deleteOne', { document: true, query: false }, function() {
    this.constructor.getAverageRating(this.reviewee);
});

module.exports = mongoose.model('Review', reviewSchema);
