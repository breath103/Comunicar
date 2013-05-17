var request = require('supertest');
var http = require("http");
var Step = require("step");
var server = null;

var database = require("../database");
var appInit = require("../app");

describe("API", function() {
    before(function(done) {
		try {
		    Step(function() {
		    	console.log("DB init start");
		        require("../database")(this);
		    }, function(err, db) {
		    	console.log("DB init END");
		        try{
		            require("../app")(db, this);
		        }
		        catch(e){
		            console.log(e);
		        }
		    }, function(err, app) {
		        http.createServer(app).listen(app.get('port'), function(err) {
		            console.log("Express server listening on port " + app.get('port'));
		            
		            request = request(app);
		            done();
		        });
		    });
		}
		catch (e) {
		    console.log(e);
		}
    });
     /*
    describe("USER API", function() {
        var userOne = null;
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
});
