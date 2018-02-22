// Database requirements
const common = require("./databaseS.common");
const mongoose = common.mongoose;
const levelModel = common.models.level;
const db = common.db;
const levelId = process.argv.slice(3)[0].substr(2);
const pathLevel = __dirname + "/../dbFiles/level" + levelId + ".json";
const data = JSON.parse(fs.readFileSync(pathLevel));

db.once('open', () => {
    let levelInstance = new levelModel(data);
    levelInstance.save((err) => {
        if(err) {
            console.log(err);
            mongoose.connection.close();
        }
        else {
            console.log("UPLOAD SUCCESSFUL");
            mongoose.connection.close();
        }
    });
});

