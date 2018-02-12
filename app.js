// Main requirements
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
// Database requirements
const mongoose = require('mongoose');
const mongoUrl = "mongodb://" + process.env.MONGO_USER + ":" + process.env.MONGO_PASS + "@its-not-raining-shard-00-00-nbjkh.mongodb.net:27017,its-not-raining-shard-00-01-nbjkh.mongodb.net:27017,its-not-raining-shard-00-02-nbjkh.mongodb.net:27017/its-not-raining?ssl=true&replicaSet=its-not-raining-shard-0&authSource=admin"

// Express Setup
const app = express();
const PORT = process.env.PORT || 1337;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// Router Setup
var gameRouter = express.Router();
app.use(express.static('html'));
app.use('/', gameRouter);
// Models Setup
var levelModel = require('./models/level');
var scoreModel = require('./models/score');
// DB Setup
mongoose.connect(mongoUrl);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB (mLab) connection error:'));

// Start server only after DB is connected
db.once('open', () => {
	app.listen(PORT, function () {
		console.log("Listening on port 1337 . . .");
	});
});

// Routes
gameRouter.route('/')
	.get((req, res, next) => {
		res.status(200).sendFile(path.join(__dirname + '/html/index.html'));
	});

gameRouter.route('/getLevel')
	.post((req, res, next) => {
		console.log(req.method, " ", (req.originalUrl || req.url), " LevelID: ", req.body["id"]);
		if (req.body["id"] >= 0) {
			getLevel(req.body["id"]).then((level) => {
				console.log(level);
				res.json(level);
			});
		} 	
		else {
			let level = getLevel(0);
			res.json(level);
		}
	});

gameRouter.route('/score')
	.post((req, res, next) => {
		console.log(req.method, " ", (req.originalUrl || req.url), ": ", req.body);
		saveScore(res, req.body);
	});

// DB Connections
async function getLevel(idN) {
	let level = await levelModel.find({id: idN}).exec().then((levels) => {
		return levels[0];
	});
	return level;
}

function saveScore(res, userScore) {
	let scoreInstance = new scoreModel(userScore);
	scoreInstance.save((err) => {
		if(err) console.log(err);
	});
	res.sendStatus(200);
}

module.exports = app;
