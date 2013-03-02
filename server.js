var http = require("http"),
    Step = require("step");

process.on('uncaughtException', function(err) {
    console.error(err.stack);
});


try {
    Step(function() {
    	console.log("DB init start");
        require("./database")(this);
    }, function(err, db) {
    	console.log("DB init END");
        try{
            require("./app")(db, this);
        }
        catch(e){
            console.log(e);
        }
    }, function(err, app) {
        http.createServer(app).listen(app.get('port'), function(err) {
            console.log("Express server listening on port " + app.get('port'));
        });
    });
}
catch (e) {
    console.log(e);
}

