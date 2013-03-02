var request = require('supertest');
var http = require("http");
var Step = require("step");
var server = null;

/*
var database = require("../database");
var appInit = require("../app");

describe("API", function() {
    before(function(done) {
        Step(function() {
            database(this);
        }, function(err, db) {
            appInit(db, this);
        }, function(err, app) {
            server = http.createServer(app);
            server.listen(app.get('port'), function(err) {
                console.log("Express server listening on port " + app.get('port'));
                request = request(server);
                done();
            });
        });
    });

    describe("USER API", function() {
        describe("GET /users/:id([0-9]+).json", function() {
            it("should show user with valid id", function(done) {
                request.get("/api/users/10.json").expect(200, done);
            });
            it("should show error with invalid id", function(done) {
                request.get("/api/users/15124512.json").expect(500, done);
            });
        });

        describe("GET /users.json", function() {
            it("should show all users", function(done) {
                request.get("/api/users.json").expect(200, done);
            });
        });
    });

});
*/