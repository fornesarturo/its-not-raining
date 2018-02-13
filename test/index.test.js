'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require("../app");
const should = chai.should();
//const expect = chai.expect;
chai.use(chaiHttp);

describe('Blobs', () => {
    it('should list ALL blobs on /blobs GET', (done) => {
        chai.request(app)
        .get('/')
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });
    it('should list a SINGLE blob on /blob/<id> GET');
    it('should add a SINGLE blob on /blobs POST');
    it('should update a SINGLE blob on /blob/<id> PUT');
    it('should delete a SINGLE blob on /blob/<id> DELETE');
});

// const request = require('supertest');


// describe('API Integration Tests', function() {
//     it('Should pass GET at /', function(done) { 
//         request(app).get('/')
//         .end(function(err, res) { 
//             expect(res.statusCode).to.equal(200); 
//             done(); 
//         });
//     });
//     it('Should pass POST at /getLevel and JSON must have proper data', function(done) {  
//         request(app).post('/getLevel')
//         .send({"id": 1})
//         .end(function(err, res) { 
//             expect(res.statusCode).to.equal(200);
//             expect(res.body).to.include.keys("player", "structures", "structures", "end");
//             done(); 
//         }); 
//     });
// });