var database = require("../database");
var should = require("should");

describe("API", function() {
    

    var schema;
    before(function(done){
        database(function(err, db) {
            schema = db;
            should.exist(schema);
            done();
        }); 
    });  
    
    describe(" DB Should Be Initialized",function(){
    	it("++",function(){
	   		should.exist(schema);
	   	});
    });
    
    describe(" Models ", function() {
        describe(" User Model", function() {
            it("should on schema", function() {
                should.exist(schema.models.User);
            });
            
            it("should connect with User tables",function(done) {
                var User = schema.models.User;
                User.all(function(err,users){
                    console.log(err,users);
                    done();
                });
            });
        });
    });
    
    
    
    
});
