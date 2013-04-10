var database = require("../database");
var should = require("should");
var request = require('supertest');

/*
describe("API", function() {
    describe("GET /api/users.json", function() {
        it("should show all users", function(done) {
            request.get("/api/users.json")
                .expect(200)
                .end(function(err, res){
                    var users = JSON.parse(res.text);
                    users.should.be.an.instanceOf(Array);
                    userOne = users[0];
                    done();
                });
        });
    });
});
*/