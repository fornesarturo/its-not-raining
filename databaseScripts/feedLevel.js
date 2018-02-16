// Database requirements
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const levelModel = require('../models/level');
const config = require('../_config');
// DB Setup
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI[app.settings.env], (err) => {
	if(err) {
		console.log('Error connecting to the database: ' + process.env.MONGO_DB + "\n" + err);
	} 
	else {
		console.log('Connected to Database: ' + process.env.MONGO_DB);
	}
});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


let data = require('../levels/level1');

db.once('open', () => {
    let levelInstance = new levelModel(data);
    levelInstance.save((err) => {
        if(err) {
            console.log(err);
            mongoose.connection.close();
        }
        else {
            console.log("UPLOAD SUCCESSFUL");
            mongoose.connection.close();
        }
    });
});

