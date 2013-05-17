var util = require("util");

module.exports = function(content,app){
	
	var defaultPath = util.format("/contents/%s/",content.name);
	var viewPath 	= util.format("contents/%s/",content.name);
	
	app.get(defaultPath + "client",function(req,res){
    	res.render(viewPath + "client",{
    		content : req.content
    	});
    });
    app.get(defaultPath + "view",function(req,res){
    	res.render(viewPath + "view",{
    		content : req.content
    	});
    });

};	