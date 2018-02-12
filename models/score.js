const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var scoreSchema = new Schema({
    userId: String,
    score: {
        type: Number,
        min: 0
    }
});

scoreSchema.path("userId").validate((value) => {
    return value.length <= 10;
}, "The maximum length is 10.");

var scoreModel = mongoose.model('Score', scoreSchema);
module.exports = scoreModel;