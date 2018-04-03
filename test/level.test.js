'use strict';

process.env.NODE_ENV = "test";

// Level to test
const levelId = process.argv.slice(3)[0].substr(2);
const pathLevel = __dirname + "/../dbFiles/level" + levelId + ".json";

// Setting up env to handle level testing
process.env.TESTING_LEVEL = levelId;

const common = require("./common.test");
// App and functionalities
const app = common.app;
const path = common.path;
const fs = common.fs;
// Chai & App
const chai = common.chai;
// Models
const mongoose = common.mongoose;
const levelModel = common.models.levelModel;

// Readline functionality
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.setPrompt("\nAT ANY MOMENT:\nIf you would like to reload the page with a level change save your changes and write 'r'\nElse write 'q' and the program will quit:\n");

// Function to drop the level
function dropLevel() {
    levelModel.collection.drop((err) => {
        // NOTHING IS HANDLED
    });
}
// Function to re-upload level when request
function reloadLevel() {
    let level = JSON.parse(fs.readFileSync(pathLevel));
    let levelInstance = new levelModel(level);
    levelInstance.save((err) => {
        if(err) console.log("Error on beforeEach hook when saving to DB:\n", err);
        else console.log("Uploading new level");
    });
}

function dropAndReload() {
    levelModel.collection.drop((err) => {
        let level = JSON.parse(fs.readFileSync(pathLevel));
        let levelInstance = new levelModel(level);
        levelInstance.save((err) => {
            if(err) console.log("Error on beforeEach hook when saving to DB:\n", err);
            else console.log("Uploading new level");
        });
    });
}

// Server start
describe("WAITING FOR SERVER TO START BEFORE TESTS", function() {
    before(function(done) {
        console.log("\n\nFEED OF SETUP~~~~~~~~~~~~~~~~");
        this.timeout(5000);
        setTimeout(done, 4000)
    })
    it("SERVER STARTED", function(done) {
        console.log("END OF SETUP~~~~~~~~~~~~~~~~~\n");
        chai.expect(true).to.be.true;
        done();
    })
});

// Level test
describe("TESTING LEVEL " + levelId, function(){
    before(function(done) {
        this.timeout(10000);
        reloadLevel()
        done()
    });
    after(function(done) {
        dropLevel()
        done();
    });
    it("SHOULD DEPLOY LEVEL FOR TESTING", function(done) {
        this.timeout(Number.MAX_SAFE_INTEGER);
        chai.request(app);
        rl.prompt();
        rl.on('line', (approval) => {
            if(approval == "r") {
                dropAndReload();
                rl.prompt();
            }
            else if(approval == "q") {
                rl.close()
            }
        }).on('close',function(){
            done();
            process.exit(0);
        });
    });
});


