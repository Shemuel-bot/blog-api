const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    timeStamp: {type: String, required: true},
    user: {type: Schema.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('Post', PostSchema);