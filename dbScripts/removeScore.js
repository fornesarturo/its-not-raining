// Database requirements
const common = require("./databaseS.common");
const mongoose = common.mongoose;
const scoreModel = common.models.scoreModel;
const db = common.db;

db.once('open', () => {

    // scoreModel.remove({score: {$lt: 20000, $gt: 10000}}, (err) => {
    scoreModel.remove({userId: "as"}, (err) => {
        if(err) console.log(err);
        else console.log("REMOVED");
        mongoose.connection.close();
        process.exit(0);  
    });
});