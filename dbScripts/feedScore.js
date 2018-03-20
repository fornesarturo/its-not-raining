const scoreId = process.argv.slice(2)[0].substr(2);
const pathScore = __dirname + "/../dbFiles/score" + scoreId + ".json";

// Database requirements
const common = require("./databaseS.common");
const mongoose = common.mongoose;
const scoreModel = common.models.scoreModel;
const db = common.db;
const fs = common.fs;
const data = JSON.parse(fs.readFileSync(pathScore));

let scoreInstance = new scoreModel(data);
scoreInstance.save((err) => {
    if(err) console.log(err);
    else {
        console.log("SCORE UPLOADED SUCCESSFULLY");
    }
    mongoose.connection.close();
    process.exit(0);
});