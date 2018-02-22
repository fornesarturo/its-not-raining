const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const scoreModel = require('../models/score');
const levelModel = require('../models/level');
const config = require('../_config');
const fs = require("fs");
const path = require('path')

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI["development"], (err) => {
	if(err) {
		console.log('Error connecting to the database: ' + process.env.MONGO_DB + "\n" + err);
	} 
	else {
		console.log('Connected to Database: ' + process.env.MONGO_DB);
	}
});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports.mongoose = mongoose;
module.exports.models = {scoreModel: scoreModel, levelModel:levelModel};
module.exports.db = db;
module.exports.fs = fs;
module.exports.path = path;
