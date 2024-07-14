const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content: {type: String, required: true},
    user: {type: String, required: true},
    post: {type: Schema.ObjectId, ref: 'Post', required: true},
});

module.exports = mongoose.model('Comment', CommentSchema);