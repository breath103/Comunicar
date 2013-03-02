var request = require('supertest');
var http = require("http");
var Step = require("step");
var server = null;


var database = require("../database");
var appInit  = require("../app");

describe("API", function() {
	before(function(done) {
        	Step(function(){
        		database(this);
			},function(err,db){
				appInit(db,this);
			},function(err,app){ 
				server = http.createServer(app);
				server.listen(app.get('port'), function(err) {
			    	console.log("Express server listening on port " + app.get('port'));
			    	request = request(server);
			    	done();
			    });
			});
		});
		
	describe("USER API", function() {
        describe("GET /users/:id([0-9]+).json",function(){
			it("should show user with valid id", function(done) {
	    	    request.get("/users/10.json")
	        		   .expect(200, done);
	        });
	        it("should show error with invalid id", function(done) {
	    	    request.get("/users/15124512.json")
	        		   .expect(500, done);
	        });
		});
		
		describe("GET /users.json",function(){
	        it("should show all users", function(done) {
		        request.get("/users.json")
		        	   .expect(200, done);
	        });
	    });
	    
	    describe("GET /users/:id([0-9]+)/papers/participating.json",function(){
	    	it("should show all currently participating papers", function(done) {
		        request.get("/users/10/papers/participating.json")
		        	   .expect(200, done);
	        });
	    });
	    
	    describe("GET /users/:id([0-9]+)/friends.json",function(){
	        it("should show all user friends for valid ", function(done) {
		        request.get("/users/10/friends.json")
		        	   .expect(200, done);
	        });
	    });
	});
	
	
	
	describe("PAPER API",function(){
		describe("GET /papers/:id([0-9]+).json",function(){
			it("should show paper with valid id and auth", function(done) {
	    	    request.get("/papers/117.json?user=10")
	        		   .expect(200, done);
	        });
	        it("should show error with invalid id", function(done) {
	    	    request.get("/papers/15124512.json")
	        		   .expect(500, done);
	        });
	        it("should show error with invalid user id", function(done) {
	    	    request.get("/papers/117.json?user=51521")
	        		   .expect(500, done);
	        });
		});
	});
	
});
