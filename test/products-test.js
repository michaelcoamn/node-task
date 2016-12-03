var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var assert = require('assert');
var request = require('supertest'); 
const server = require('../app');

describe('GET Products validation test', () => {
  var url = "http://localhost:3000";

  it('should return that field does not exist', (done) => {
      request("http://localhost:3000").get('/products?field=priced').end(function(err, res)
      {
        expect(res.body.errors).to.eql([{"param":"field",
                                  "msg":"The field 'priced' does not exist.","value":"priced"}]);
        done();
      })
  });

  it('should return that price value is not valid', (done) => {
      request("http://localhost:3000").get('/products?field=price&value=52fasd').end(function(err, res)
      {
        expect(res.body.errors).to.eql([{"param":"value","msg":
                      "The value 52fasd is not valid for the field price","value":"52fasd"}]);
        done();
      })
  });

  it('should return that sort value is not valid', (done) => {
      request("http://localhost:3000").get('/products?field=price&sort=-6').end(function(err, res)
      {
        expect(res.body.errors).to.eql([{"param":"sort","msg":
                                              "sort should be either 1 or -1. The input was -6","value":"-6"}]);
        done();
      })
  });

  it('should return that the limit must be a possitive number', (done) => {
      request("http://localhost:3000").get('/products?limit=l').end(function(err, res)
      {
        expect(res.body.errors).to.eql([{"param":"limit","msg":
                                            "limit must be a possitive number. The input was l","value":"l"}]);
        done();
      })
  });  
});