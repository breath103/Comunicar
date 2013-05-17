var util = require("util");

module.exports = function(content,app){
	
	var Question = app.DAO.Question;
	
	var defaultPath = util.format("/contents/%s/",content.name);
	var viewPath 	= util.format("contents/%s/",content.name);
	
	app.get(defaultPath + "client",function(req,res){
    	res.render(viewPath + "client",{
    		content : req.content
    	});
    });
    app.get(defaultPath + "view",function(req,res){
		Question.find({},function(error,questions){
			console.log(questions);
			res.render(viewPath + "view",{
				questions : questions,
	    		content : req.content
	    	});
		});
    });

};	