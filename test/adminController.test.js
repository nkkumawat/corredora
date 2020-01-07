const req = require('chai');
const chaiHttp = require('chai-http');
const should = req.should();
const app = require('../app.js');
const constants = require('../config/constants');
req.use(chaiHttp);


describe('GET /admin/login', function() {
  it('return html response', function() {
    req.request(app)
      .get('/admin/login')
      .end(function(err, res){
        res.should.have.status(200);
    });
  })
})

describe('POST /admin/login', function() {
  it('should redirect to /dashboard', function() {
    req.request(app)
      .post('/admin/login')
      .send({email: constants.ADMIN['email'], password: constants.ADMIN['password']})
      .end(function(err, res) {
        res.should.have.status(200);
      });
  })
})