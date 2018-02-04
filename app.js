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
	.get(function(req, res, next) {
		res.status(200).sendFile(path.join(__dirname + '/html/index.html'));
	});
gameRouter.route('/getLevel')
	.post(function (req, res, next) {
		console.log(req.method + " " + (req.originalUrl || req.url) + " LevelID: " + req.body["id"]);
		if (req.body["id"] >= 0) {
			let level = getLevel(req.body["id"]);
			res.json(level);
		} 
		else {
			let level = getLevel(-1);
			res.json(level);
		}
	});

app.listen(PORT, function () {
	console.log("Listening on port 1337 . . .");
});

function getLevel(id) {
	let level;
	var optionsDB = {
        database: 'its-not-raining',
		collectionName: 'levels',
		query: '{"id": ' + id + '}',
    };
    mLab.listDocuments(optionsDB, function (err, collections) {
		console.log('Found: ' + collections.length);
		if (collections.length > 0)
			level = collections[0];
		else
			level = null;
	});
	return level;
}

module.exports = app;