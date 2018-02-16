const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

var levelSchema = new Schema({
    id: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    player: [Number], 
    structures: [[Number]],
    obstacles: [{
        coordinates: [Number],
        setup: String,
        behaviour: String
    }],
    end: {
        type: [Number],
        required: true
    },
    text: [{
        fill: [Number],
        textSize: Number,
        texts: [[]]
    }]
});

// levelSchema
// .virtual('url')
// .get(() => {
//   return '/level/' + this._id;
// });

var levelModel = mongoose.model('Level', levelSchema);
module.exports = levelModel;