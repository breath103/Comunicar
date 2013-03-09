

var socketIO = require("socket.io");
var Step = require("step");
var util = require("util");
var fs = require('fs');
var path = require("path");

module.exports = function(params,callback){
    console.log("	--CONTENTS_IMPLEMENTS--");
  

	var io = socketIO.listen(params.server);
    
    params = {
		io  : io,
		app : params.app,
		server : params.server  
    };
    
    var Content = params.app.db.models.Content;
    
    Step(function(){
	    Content.all(this);
    },function(err,contents) { 
	    if(err) console.log(err);
	    else {
	    	contents.forEach(function(v){
	    		if (fs.existsSync(path.join(__dirname,v.name) )) {
		    		console.log("				"+v.name);
		    		
	    			require(util.format("./%s",v.name))(v,params);
	    			
	    			console.log("				"+v.name + " END");
		    	}else{
			    	console.log(v.name + " not exist");
		    	}
		    });
	    }
	    callback();
	    console.log("	--CONTENTS_IMPLEMENTS--");
    });
}