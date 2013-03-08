
module.exports = function(app){
	
	var defaultPath = "/contents/Comunicar/";
	var viewPath = "contents/Comunicar/";
	
	app.get(defaultPath + "client",function(req,res){
    	res.render(viewPath + "client",{
    		content : req.content
    	});
    });
    
    console.log(app.routes);
};	