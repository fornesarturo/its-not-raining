const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

var levelTextSchema = new Schema({
    id: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    en: [{
        fill: [Number],
        textSize: Number,
        texts: [[]]
    }],
    es: [{
            fill: [Number],
            textSize: Number,
            texts: [[]]
    }]
});

var levelTextModel = mongoose.model('LevelText', levelTextSchema);
module.exports = levelTextModel;