'use strict';

var chai = require("chai");
const request = require('supertest');
// const nock = require("nock");

const app = require("../app");

var expect = chai.expect;

describe('API Integration Tests', function() {
    it('Should pass GET at /', function(done) { 
        request(app).get('/')
        .end(function(err, res) { 
            expect(res.statusCode).to.equal(200); 
            done(); 
        });
    });
    it('Should pass POST at /getLevel and JSON must have proper data', function(done) {  
        request(app).post('/getLevel')
        .send({"id": 1})
        .end(function(err, res) { 
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.include.keys("player", "structures", "structures", "end");
            done(); 
        }); 
    });
});