var util = require("util");
module.exports = function(app) {
    console.log("       --Contents--");


    var Content = app.db.models.Content;
    
    app.get("/contents",function(req,res,next){
    	Content.all(function(err,contents) { 
	    	if(err) next(err);
	    	else {
	    		res.render("contents/list",{contents: contents});
	    	}
    	});
    });

    app.get("/contents/:name",function(req,res,next){
    	Content.findOne({ where : {name : req.param("name") }} ,function(err,content) { 
	    	if(err) next(err);
	    	else {
	    		if(content){
		    		req.content = content;
		    		next();	
	    		}else{
		    		next(new Error("no content with name : " + req.param("name")));
	    		}
	    	}
    	});
    });
    
    
    console.log("       --Contents END--");
}