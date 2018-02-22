// Main requirements
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
if(app.settings.env == "test") {
	const dotenv = require('dotenv').config({path: './test.env'});
}
else {
	const dotenv = require('dotenv').config();
}
// Database requirements
const config = require('./_config');
const mongoose = require('mongoose');

// Express Setup
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
mongoose.Promise = global.Promise;
var envir = app.settings.env || "development";
var dbUrl = config.mongoURI[envir] ;
console.log("ENVIRONMENT", envir);
mongoose.connect(dbUrl, (err) => {
	if(err) {
		console.log('Error connecting to the database: ', process.env.MONGO_DB, "\n", err);
	} 
	else {
		console.log('Connected to Database: ', process.env.MONGO_DB, "\n");
	}
});
let db = mongoose.connection;
db.on('error', (err) => {
	console.error.bind(console, 'MongoDB connection error:');
});

// Start server only after DB is connected
db.once('open', () => {
	app.listen(PORT, function () {
		console.log("Listening on port ", PORT, " . . .");
	});
});

// Routes
gameRouter.route('/')
	.get((req, res, next) => {
		res.status(200).sendFile(path.join(__dirname + '/html/index.html'));
	});

gameRouter.route('/getLevel')
	.post((req, res, next) => {
		if(process.env.TESTING_LEVEL) {
			console.log("REQUESTING LEVEL TEST WITH LEVEL ID: ", process.env.TESTING_LEVEL)
			getLevel(process.env.TESTING_LEVEL).then((level) => {
				res.json(level);
				res.status(200);
			});
		}
		else {
			console.log(req.method, " ", (req.originalUrl || req.url), " LevelID: ", req.body["id"]);
			if(req.body["id"] >= 0) {
				getLevel(req.body["id"]).then((level) => {
					res.json(level);
					res.status(200);
				});
			} 	
			else {
				let level = getLevel(0);
				res.json(level);
			}
		}
	});

gameRouter.route('/score')
	.get((req, res, next) => {
		console.log(req.method, " ", (req.originalUrl || req.url));
		getScores().then((scores) => {
			res.json(scores);
		})
	})
	.post((req, res, next) => {
		if(process.env.TESTING_LEVEL) {
			console.log("POSTING SCORE IN TEST WITH LEVEL ID: ", process.env.TESTING_LEVEL)
			console.log(req.method, " ", (req.originalUrl || req.url), ": ", req.body);
		}
		else {
			console.log(req.method, " ", (req.originalUrl || req.url), ": ", req.body);
			saveScore(res, req.body);
		}
	});

// DB Connections
async function getLevel(idN) {
	let level = await levelModel.find({id: idN}).exec().then((levels) => {
		if (levels.length <= 0){
			return null;
		}
		return levels[0];
	});
	return level;
}

async function getScores() {
	let leaderboard = await scoreModel.find({}).sort({ score: 1 }).exec().then((scores) => {
		return scores;
	});
	return leaderboard;
}

function saveScore(res, userScore) {
	let scoreInstance = new scoreModel(userScore);
	scoreInstance.save((err) => {
		if(err) {
			console.log(err);
		}
		else {
			successRes = {};
			successRes["SUCCESS"] = userScore;
			res.status(200);
			res.json(successRes);
		}
	});
}

module.exports = app;
