var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var assert= require('assert');
chai.use(chaiHttp);

var should = chai.should();
// var expect = chai.expect;

describe('Server Test', function() {

  it('List of users', function(done) {

    chai.request(server)
    .get('/users/names')
    .end(function(err, res) {
       res.should.have.status(200);
      done();
    });
  });

  it('Have users?', function(done) {

    chai.request(server)
    .get('/users/names')
    .end(function(err, res) {
        assert(res.body.userNames!==undefined);

      done();
    });
  });

  it('List of replies', function(done)
{
  chai.request(server)
  .get('/users/demo_ebony/replies')
  .end(function(err,res){
    res.should.have.status(200);
    done();
  });
});
it('Users have files?', function(done) {

  chai.request(server)
  .get('/users/demo_kenneth/replies')
  .end(function(err, res) {
    console.log(res.body.fileNames);
      assert(res.body.fileNames!==undefined);

    done();
  });
});
it('Have text', function(done)
{
  chai.request(server)
  .get('/users/demo_ebony/replies/1483542493197.json')
  .end(function(err,res){
  res.should.have.status(200);
  done();
});
});
it('Have text field?!',function(done){

    chai.request(server)
    .get('/users/demo_ebony/replies/1483542493197.json')
    .end(function(err, res) {
      console.log(res.body.replyText);
        assert(res.body.replyText!==undefined);
      done();
    });
  });
it('Can connect to socket', function (done) {
    var io = require('socket.io-client');
    var options = {
      transports: ['websocket'],
      'force new connection': true,
      path: '/socket.io-client'
    };
    var client = io("http://localhost:3300/", options);
    client.once('connect', function () {
      console.log('connected')
      done();
    });
  });
});
