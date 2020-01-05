var req = require('chai');
var chaiHttp = require('chai-http');
var should = req.should();
var app = require('../app.js');
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
      .send({email: 'demo@gmail.com', password: 'password'})
      .end(function(err, res) {
        res.should.have.status(200);
      });
  })
})