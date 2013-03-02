var express = require('express'),
    http = require('http'),
    path = require('path'),
    app = express();

module.exports = function(db, callback) {
    console.log("APP_START");

    app.db = db;
    app.configure(function() {
        app.set('port', process.env.PORT || 8001);
        app.set('views', __dirname + '/views');
        app.set('view engine', 'ejs');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        
        app.use(express.cookieParser());
        app.use(express.session({ secret: 'Comunicar', store: new express.session.MemoryStore }));
        
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        
        app.use(app.router);
        app.use(express.static(path.join(__dirname, 'public')));


    });

    app.configure('development', function() {
        app.use(express.errorHandler());
        /*
	    app.use(function(err,req,res,next){
	    	res.json({
		    	error : err.toString()
	    	});
	    });
	    */
    });

    app.all('*', function(req, res, next) {
        res.charset = "UTF-8";
        next();
    });
    app.all('*.json', function(req, res, next) {
        res.setHeader('Content-Type', 'application/json');
        next();
    });


    console.log("ROUTE_START");
    require('./routes')(app);
    console.log("ROUTE_END");


    console.log("APP_CREATE_SUCCESS");
    callback(null, app);
}
