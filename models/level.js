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
    bounceObstacles: [[Number]],
    ice: [[Number]],
    obstacles: [{
        coordinates: [Number],
        setup: String,
        behaviour: String,
        immune: Boolean,
        colorFill: String
    }],
    end: {
        type: [Number],
        required: true
    },
    text: {
        type: Boolean
    }
});

// levelSchema
// .virtual('url')
// .get(() => {
//   return '/level/' + this._id;
// });

var levelModel = mongoose.model('Level', levelSchema);
module.exports = levelModel;