// Database requirements
const common = require("./databaseS.common");
const mongoose = common.mongoose;
const levelModel = common.models.levelModel;
const db = common.db;

db.once('open', () => {

    levelModel.remove({id: "1"}, (err) => {
        if(err) console.log(err);
        else console.log("REMOVED");
        mongoose.connection.close();
        process.exit(0);  
    });
});