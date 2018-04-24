const levelId = process.argv.slice(2)[0].substr(2);

const levelIdRem = process.argv.slice(2)[0].substr(2);

// Database requirements
const common = require("./databaseS.common");
const mongoose = common.mongoose;
const levelTextModel = common.models.levelTextModel;
const db = common.db;

db.once('open', () => {

    levelTextModel.remove({id: levelIdRem}, (err) => {
        if(err) console.log(err);
        else console.log("REMOVED: ", levelIdRem);
        mongoose.connection.close();
        process.exit(0);  
    });
});
