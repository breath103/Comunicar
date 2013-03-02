var database = require("../database");
var should = require("should");

describe("API", function() {
    

    var schema;
    before(function(done){
        database(function(err, db) {
            should.exist(db);
            schema = db;
            done();
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





    /*
    var schema = null;
    before(function(done) {
        database(function(err,db){
            console(err,db);
            schema = db;
            done();
        });
    });
    
    
    describe(" User Model ", function(done) {
        var User = schema.models.User;
        it(" Should Connect With User Table", function(done) {
            User.all(function(err,users){
                console.log(users);
            });
        });
    });
    */
});
