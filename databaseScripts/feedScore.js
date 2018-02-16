// Database requirements
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const scoreModel = require('../models/score');
const config = require('../_config');

// DB Setup
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

data = {};

let scoreInstance = new scoreModel(data);
scoreInstance.save((err) => {
    if(err) console.log(err);
});