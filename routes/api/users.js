// USER
module.exports = function(app){
    console.log("       --USERS--");
	
    
    var User = app.db.models.USER;
    User.findWithId = function(req, res, next) {
    	User.get(req.params.id,function(err,user){
	        if(err) next(err);
	        else{
		        req.user = user;
		        next();
	        }
	    });
	    /*next(new Error('Failed to load user ' + req.params.id));*/
	};
	
	app.get("/users.json",function(req,res,next){
		User.find(function(err,users){
			if(err) next(err);
			else res.json(users);
		});
	});
	
	app.get("/users/:id([0-9]+).json",User.findWithId,function(req,res){
		res.json(req.user);
    });   
    
    app.get("/users/:id([0-9]+)/papers/participating.json",User.findWithId,function(req,res,next){
       	req.user.getParticipatingPapers(function(err,papers){
	    	if(err) next(err);
	       	else res.json(papers);
	    });
	});
	
    app.get("/users/:id([0-9]+)/friends.json",User.findWithId,function(req,res,next){
       	req.user.getFriends(function(err,friends){
	    	if(err) next(err);
	       	else res.json(friends);
	    });
	});
	
	
	
	console.log("       --USERS END--");
}