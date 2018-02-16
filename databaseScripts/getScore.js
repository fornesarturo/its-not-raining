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

db.once('open', () => {

    // scoreModel.remove({userId: "Andres"}, (err) => {
    //     if(err) console.log(err);
    //     else console.log("REMOVED");
    // });
    
    // scoreModel.update({"$or":
    //                     [{userId: "ANDB"}, 
    //                     {userId: "TEFY"}, 
    //                     {userId: "JERA"}]
    //                 }, 
    //                 {userId: "BARRO DEJA DE HACER TRAMPA"}, 
    //                 { multi: true },
    //                 (err) => {
    //                     if(err) console.log(err)

    // });

    scoreModel.find({}, (err, scoresS) => {
        if(err) {
            console.log(err);
            mongoose.connection.close();
        }
        else {
            console.log(scoresS);
            mongoose.connection.close();
        }
    });
});