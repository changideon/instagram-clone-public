const mongoose = require('mongoose');
//could add likes into the schema for each comment in the future

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    text: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);