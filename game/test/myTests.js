'use strict';

//var request = require('superagent');
var expect = require('expect.js');

describe('isMochaWorking', function () {
    it('should add 1+1 correctly, if Mocha is working', function (done) {
        var onePlusOne = 1 + 1;
        onePlusOne.should.equal(2);
        // must call done() so that mocha know that we are... done.
        // Useful for async tests.
        done();
    });
});

/*
describe('Suite one', function(){
    it (function(done){
        request.post('http://192.168.7.226:8080/').end(function(res){
            expect(res).to.exist;
            res.statusCode.should.equal(200);
            done();
        });
    });
});*/
