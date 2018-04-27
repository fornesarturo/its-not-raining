const levelId = process.argv.slice(2)[0].substr(2);
const pathLevel = __dirname + "/../dbFiles/levelText/text" + levelId + ".json";

// Database requirements
const common = require("./databaseS.common");
const mongoose = common.mongoose;
const levelTextModel = common.models.levelTextModel;
const db = common.db;
const fs = common.fs;
const data = JSON.parse(fs.readFileSync(pathLevel));
db.once('open', () => {
    console.log("UPLOADING LEVEL:", levelId);

    let levelTextInstance = new levelTextModel(data);
    levelTextInstance.save((err) => {
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
