var Step = require("step");
var orm  = require("orm");

module.exports = function(callback){
    Step(function(){
        orm.connect("mysql://root:1234@210.122.0.119/RollingPaper", this);    
    },function(err,db){
    	console.log(" MYSQL CONNECTED");
	    if (err) 
	    	callback(err,db);
        db.load("./models/models",function(err){ 
            if(err) 
            	throw err;
            console.log(" MODEL LOADED ");
            callback(err,db);
        });
    });
}
