var http = require("http"),
	Step = require("step");

process.on('uncaughtException', function(err) {
	console.error(err.stack);
});


try{
	Step(function(){
		require("./database")(this);
	},function(err,db){
		require("./app")(db,this);
	},function(err,app){ 
		http.createServer(app).listen(app.get('port'), function(err) {
	        console.log("Express server listening on port " + app.get('port'));
	    });
	});	
}
catch(e){
	console.log(e);
}


/*
app.createApp(function(err,app){
    
});
*/