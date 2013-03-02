// PAPER
module.exports = function(app){
    console.log("       --ROLLING_PAPERS--");
	
	var Papers = app.db.models.ROLLING_PAPER;
	var PaperTicket = app.db.models.ROLLING_PAPER_TICKET;
    Papers.findWithId = function(req, res, next) {
    	Papers.get(req.params.id,function(err,paper){
	        if(err) next(err);
	        else{
		        req.paper = paper;
		        next();
	        }
	    });
	};
	
	Papers.check_ticket_auth = function(req,res,next){
		PaperTicket.find({
			user_idx  : req.query.user,
			paper_idx : req.params.id
		},function(err,tickets){
			if(err)
				next(err);
			else{
				console.log(tickets);
				if(tickets && tickets.length > 0){
					next();
				}	
				else{
					next(new Error("user don't have ticket to paper"));
				}	
			}
		});
	};
	
	app.get("/papers/:id([0-9]+).json", 
		Papers.check_ticket_auth,Papers.findWithId,
		function(req,res){
			res.json(req.paper);
		});   
    
	/*
	app.get("/users.json",function(req,res,next){
		User.find(function(err,users){
			if(err) next(err);
			else res.json(users);
		});
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
	*/
	
	
	console.log("       --ROLLING_PAPERS END--");
}