var util = require("util");
module.exports = function(app) {
    console.log("       --Contents--");

    var Content = app.db.models.Content;
    
    
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
    
    app.get("/contents/:name",function(req,res){
    	res.render("contents/" + req.content.name,{
    		content : req.content
    	});
    });

    console.log("       --Contents END--");
}