// Database requirements
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const levelModel = require('../models/level');
const mongoUrl = "mongodb://" + process.env.MONGO_USER + ":" + process.env.MONGO_PASS + "@its-not-raining-shard-00-00-nbjkh.mongodb.net:27017,its-not-raining-shard-00-01-nbjkh.mongodb.net:27017,its-not-raining-shard-00-02-nbjkh.mongodb.net:27017/its-not-raining?ssl=true&replicaSet=its-not-raining-shard-0&authSource=admin";
// DB Setup
mongoose.connect(mongoUrl);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
    levelModel.find({}, (err, levelsS) => {
        if(err) {
            console.log(err);
            mongoose.connection.close();
        }
        else {
            console.log(levelsS);
            mongoose.connection.close();
        }
    });
});