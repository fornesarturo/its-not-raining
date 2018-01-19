const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 1337;

var gameRouter = express.Router();
// var apiRouter = express.Router();

// app.use('/api', apiRouter);
app.use(express.static('html'));
app.use('/', gameRouter);

gameRouter.route('/')
	.get(function (req, res, next){
		res.status(200).sendFile(path.join(__dirname + '/html/index.html'));
	});

app.listen(PORT, function () {
	console.log("Listening on port 1337 . . .");
});
