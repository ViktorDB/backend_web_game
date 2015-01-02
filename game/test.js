/**
 * Created by Viktor on 02/01/15.
 */


var request = require('superagent');
var expect = require('expect.js');

// UNIT TESTS

describe('Suite one', function(){
    it (function(done){
        request.post('localhost:8000').end(function(res){
            expect(res).to.exist;
            expect(res.status).to.equal(200);
            done();
        });
    });
});