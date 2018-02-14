'use strict';

process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const levelModel = require("../models/level");
const level1 = require("../levels/level1");
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);

describe("Static HTML", function() {
    it("Should return the html using GET", function(done) {
        chai.request(app)
        .get("/")
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });
});

describe("Levels", function() {
    beforeEach(function(done) {
        this.timeout(4000);
        let levelInstance = new levelModel(level1);
        levelInstance.save((err) => {
            if(err) console.log("Error on beforeEach hook when saving to DB:\n", err);
            done();
        });
    });
    afterEach(function(done) {
        levelModel.collection.drop();
        done();
    });

    it("Should return level 1 using POST", function(done) {
        chai.request(app)
        .post("/getLevel")
        .send({"id": 1})
        .end((err, res) => {
            expect(res, "Response code isn't 200").to.have.status(200);
            expect(res, "Response isn't JSON").to.be.json;
            expect(res.body, "Response body isn't JSON").to.be.a("object");
            expect(res.body, "JSON doesn't have property 'id'").to.have.property("id", 1);
            expect(res.body, "JSON doesn't have property 'player'").to.have.property("player");
            expect(res.body, "JSON doesn't have property 'obstacles'").to.have.property("obstacles");
            expect(res.body, "JSON doesn't have property 'structures'").to.have.property("structures");
            expect(res.body, "JSON doesn't have property 'end'").to.have.property("end");
            expect(res.body.end, "Length of property 'end' isn't 4").to.have.lengthOf(4);
            done();
        });
    });
});