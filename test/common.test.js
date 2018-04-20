// App and functionalities
const app = require("../app");
const fs = require("fs");
const path = require('path')
// Chai
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);
// Models
const mongoose = require("mongoose");
const levelModel = require("../models/level");
const scoreModel = require("../models/score");
const levelTextModel = require("../models/levelText");
levelModel.collection.drop((err) => {
    if(err != null) {
        if(err.message == "ns not found") console.log("NOTHING TO DELETE IN LEVEL DB");
        else console.log(err);
    }
});
scoreModel.collection.drop((err) => {
    if(err != null) {
        if(err.message == "ns not found") console.log("NOTHING TO DELETE IN SCORE DB");
        else console.log(err);
    }
});
levelTextModel.collection.drop((err) => {
    if(err != null) {
        if(err.message == "ns not found") console.log("NOTHING TO DELETE IN LEVEL TEXT DB");
        else console.log(err);
    }
});

const models = { levelModel: levelModel, scoreModel: scoreModel, levelTextModel: levelTextModel };
// Samples
const level1 = (__dirname + "/../dbFiles/level/level1.json");
const score0 = (__dirname + "/../dbFiles/score0.json");
const text1 = (__dirname + "/../dbFiles/levelText/text1.json");
const samples = { level1: level1, score0: score0, text1: text1 };

module.exports.app = app;
module.exports.fs = fs;
module.exports.chai = chai;
module.exports.expect = expect;
module.exports.models = models;
module.exports.samples = samples;