const chai = require("chai");
const chaiHttp = require("chai-http")
const path = require('path');
// const nock = require("nock");
// var request = require('supertest')("http://api.postcodes.io");
const app = require(__dirname + "/../app.js");
chai.use(chaiHttp);


describe("Testing Category", () => {
    it("Test", () => {
        chai.request('http://localhost:1337')
            .get('/')
    });
});