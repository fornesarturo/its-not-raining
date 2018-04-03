const levelId = process.argv.slice(2)[0].substr(2);
const pathLevel = __dirname + "/../dbFiles/level" + levelId + ".json";

// Database requirements
const common = require("./databaseS.common");
const mongoose = common.mongoose;
const levelModel = common.models.levelModel;
const db = common.db;
const fs = common.fs;
const data = JSON.parse(fs.readFileSync(pathLevel));
db.once('open', () => {
    console.log("UPLOADING LEVEL:", levelId);

    let levelInstance = new levelModel(data);
    levelInstance.save((err) => {
        if(err) {
            console.log(err);
        }
        else {
            console.log("UPLOAD SUCCESSFUL");
        }
        mongoose.connection.close();
        process.exit(0);
    });
});
