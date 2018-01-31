const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 1337;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var gameRouter = express.Router();
// var apiRouter = express.Router();

// app.use('/api', apiRouter);
app.use(express.static('html'))
app.use('/', gameRouter);

gameRouter.route('/')
	.get(function(req, res, next) {
		res.status(200).sendFile(path.join(__dirname + '/html/index.html'));
	});
gameRouter.route('/getLevel')
	.post(function (req, res, next) {
		console.log("REQUESTING");
		console.log(req.body);
		// x, y, long, height
		if (req.body["id"] == 1) {
			let level = {
				"player": [
					[250, 800]
				],
				"structures": [
					[0, 600, 100, 1300],
					[325, 600, 50, 550],
					[625, 300, 50, 650],
					[625, 800, 50, 150],
					[900, 600, 100, 1300],
					[450, 890, 950, 50],
					[450, 5, 950, 50]
				],
				"obstacles": [
					[500, 500, 50, 50]
				],
				"end": [
					[830, 50, 35, 35]
				]
			}

			res.json(level);
		} else
			res.json({});
	});

app.listen(PORT, function () {
	console.log("Listening on port 1337 . . .");
});

module.exports = app;