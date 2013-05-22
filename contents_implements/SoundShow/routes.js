var util = require("util");
var fs   = require("fs");
module.exports = function(content,app){
	var path 	 = util.format("/contents/%s/",content.name);
	var viewPath = util.format("contents/%s/" ,content.name);
	
		
	app.get(path + "client",function(req,res){
    	res.render(viewPath + "client",{
    		content : req.content
    	});
    });
    app.get(path + "view",function(req,res){
		fs.readdir("public/contents/SoundShow/pads", function(error, files) {
			if (error) {
				res.send(500);
			}
			else {
				files.sort();
				console.log(files);
				files.forEach(function(v,k,l){
					l[k] = "pads/" + v;
				});
				console.log(files);
				res.render(viewPath + "view",{
		    		content : req.content,
					pads : files
		    	});
			}
		});
	});
	
};	