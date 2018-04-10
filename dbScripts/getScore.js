// Database requirements
const common = require("./databaseS.common");
const mongoose = common.mongoose;
const scoreModel = common.models.scoreModel;
const db = common.db;

db.once('open', () => {
    
    // scoreModel.update({"$or":
    //                     [{userId: "ANDB"}, 
    //                     {userId: "TEFY"}, 
    //                     {userId: "JERA"}]
    //                 }, 
    //                 {userId: "BARRO DEJA DE HACER TRAMPA"}, 
    //                 { multi: true },
    //                 (err) => {
    //                     if(err) console.log(err)

    // });

    // scoreModel.find({score: {$lt: 20000}}, (err, scoresS) => {
    scoreModel.find({}, (err, scoresS) => {
        if(err) {
            console.log(err);
        }
        else {
            console.log(scoresS);
        }
        mongoose.connection.close();
        process.exit(0);    
    });
});