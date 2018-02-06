const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const mongoURL = "mongodb://" + process.env.MLAB_USER + ":" + process.env.MLAB_PASS + "@ds046867.mlab.com:46867/its-not-raining";
const mLab = require('mongolab-data-api')(process.env.MLAB_KEY);
const app = express();
const PORT = process.env.PORT || 1337;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var gameRouter = express.Router();

app.use(express.static('html'))
app.use('/', gameRouter);

gameRouter.route('/')
	.get((req, res, next) => {
		res.status(200).sendFile(path.join(__dirname + '/html/index.html'));
	});

gameRouter.route('/getLevel')
	.post((req, res, next) => {
		console.log(req.method, " ", (req.originalUrl || req.url), " LevelID: ", req.body["id"]);
		if (req.body["id"] >= 0) {
			let level = getLevel(req.body["id"]);
			res.json(level);
		} 	
		else {
			let level = getLevel(-1);
			res.json(level);
		}
	});

gameRouter.route('/score')
	.post((req, res, next) => {
		console.log(req.method, " ", (req.originalUrl || req.url), ": ", req.body);
		saveScore(res, req.body);
	});

app.listen(PORT, function () {
	console.log("Listening on port 1337 . . .");
});

function getLevel(id) {
	let level;
	let optionsDB = {
        database: 'its-not-raining',
		collectionName: 'levels',
		query: '{"id": ' + id + '}',
    };
    mLab.listDocuments(optionsDB, (err, collections) => {
		level = collections[0];
	});
	return level;
}

function saveScore(res, userScore) {
	let optionsDB = {
		database: 'its-not-raining',
		collectionName: 'scores',
		documents: userScore
	};
	mLab.insertDocuments(optionsDB, (err, collections) => {
		if(err) console.dir(err);
		console.log(collections);
	});
	res.sendStatus(200);
}

module.exports = app;