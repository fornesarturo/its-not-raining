// Database requirements
const common = require("./databaseS.common");
const mongoose = common.mongoose;
const levelModel = common.models.levelModel;
const db = common.db;

db.once('open', () => {
    levelModel.find({}, (err, levels) => {
        if(err) {
            console.log(err);
            mongoose.connection.close();
        }
        else {
            console.log(levels);
            mongoose.connection.close();
        }
    });
});