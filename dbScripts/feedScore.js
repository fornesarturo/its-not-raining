// Database requirements
const common = require("./databaseS.common");
const mongoose = common.mongoose;
const levelModel = common.models.level;
const db = common.db;
const scoreId = process.argv.slice(3)[0].substr(2);
const pathScore = __dirname + "/../dbFiles/score" + scoreId + ".json";
const data = JSON.parse(fs.readFileSync(pathScore));

let scoreInstance = new scoreModel(data);
scoreInstance.save((err) => {
    if(err) console.log(err);
});