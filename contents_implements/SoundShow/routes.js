var util = require("util");

module.exports = function(content,app){
	
	var path = util.format("/contents/%s/",content.name);
	var viewPath 	= util.format("contents/%s/" ,content.name);
	
	app.get(path + "client",function(req,res){
    	res.render(viewPath + "client",{
    		content : req.content
    	});
    });
    app.get(path + "view",function(req,res){
    	res.render(viewPath + "view",{
    		content : req.content
    	});
    });
	
};	