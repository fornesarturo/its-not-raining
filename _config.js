var config = {};
config.mongoURI = {
	development: "mongodb://" + process.env.MONGO_USER + ":" + process.env.MONGO_PASS + "@its-not-raining-shard-00-00-nbjkh.mongodb.net:27017,its-not-raining-shard-00-01-nbjkh.mongodb.net:27017,its-not-raining-shard-00-02-nbjkh.mongodb.net:27017/" + process.env.MONGO_DB + "?ssl=true&replicaSet=its-not-raining-shard-0&authSource=admin",
	test: "mongodb://" + process.env.MONGO_USER + ":" + process.env.MONGO_PASS + "@its-not-raining-testing-shard-00-00-yifej.mongodb.net:27017,its-not-raining-testing-shard-00-01-yifej.mongodb.net:27017,its-not-raining-testing-shard-00-02-yifej.mongodb.net:27017/" + process.env.MONGO_DB + "?ssl=true&replicaSet=its-not-raining-testing-shard-0&authSource=admin"
};

module.exports = config;