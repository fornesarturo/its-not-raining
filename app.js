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
	.get(function (req, res, next) {
		res.status(220).sendFile(path.join(__dirname + '/html/index.html'));
	})
	.post(function (req, res, next) {
		if (req.body["id"] == 1) {
			let level = {
				"player": [
					[300, 200]
				],
				"structures": [
					[50, 300, 100, 500],
					[400, 300, 100, 500],
					[750, 300, 100, 500],
					[400, 600, 1800, 100]
				],
				"obstacles": [
					[500, 500, 50, 50]
				],
				"end": [
					[1200, 500, 50, 50]
				]
			}

			res.json(level);
		} else
			res.json(req.body);
	});

app.listen(PORT, function () {
	console.log("Listening on port 1337 . . .");
});
