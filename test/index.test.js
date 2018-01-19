const chai = require("chai");
const chaiHttp = require("chai-http")
const path = require('path');
// const nock = require("nock");
// var request = require('supertest')("http://api.postcodes.io");
// const app = require(__dirname + "/../app.js").app;
chai.use(chaiHttp);

chai.request('http://localhost:1337')
    .get('/')