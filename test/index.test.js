const chai = require("chai");
const chaiHttp = require("chai-http")
const path = require('path');
// const nock = require("nock");
// var request = require('supertest')("http://api.postcodes.io");
const app = require(__dirname + "/../app.js");
chai.use(chaiHttp);


describe("Testing Category", () => {
    it("Test", () => {
        chai.request('http://localhost')
            .get('/')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });
    it("Test 2", () => {
        chai.request('http://localhost')
            .get('/')
            .end(function(err, res) {
                expect(res).to.have.status(200);
            });
    });
});