var util = require("util");
var fs   = require("fs");
module.exports = function(content,app){
	var path 	 = util.format("/contents/%s/",content.name);
	var viewPath = util.format("contents/%s/" ,content.name);
		
	app.get("/",function(req,res){
    	res.render(viewPath + "client-parking",{
    		content : req.content
    	});
    });
	
	app.get("/client",function(req,res){
    	res.render(viewPath + "client",{
    		content : req.content
    	});
    });
	
    app.get("/view",function(req,res){
		fs.readdir(process.cwd() + "/public/contents/SoundShow/touchpads", function(error, files) {
			if (error) {
				console.log(error);
				res.send(500);
			}
			else {
				files.sort();
				console.log(files);
				files.forEach(function(v,k,l){
					l[k] = "./touchpads/" + v;
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