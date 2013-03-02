var orm = require("orm");
module.exports = function (db, cb) {
	db.settings.set("properties.association_key", "{name}_idx"); 
	
	
	
	var RollingPaper = db.define("ROLLING_PAPER", {
		idx     	   : Number,
	    creator_idx    : Number,
	    title          : String,
	    target_email   : String,
	    participants_count : Number,
	    notice     	   : String, 
	    width      	   : Number,
	    height		   : Number,
	    modify_time    : Number,
	    created_time   : Number,
	    receiver_fb_id : String,
	    receiver_name  : String,
	    receive_time   : Number,
	    receive_tel    : String,
	    is_sended      : ["NONE","SENDED"],
	    background     : String
	}, {
		id : "idx",
		methods: {
		},
	    validations: {
	    }
	});
	
	
	
	var RollingPaperTicket = db.define("ROLLING_PAPER_TICKET",{
        idx          : Number,
        user_idx     : Number,
        paper_idx    : Number
	},{
		id : "idx"
	});
	
	
	
	var User = db.define('USER', {
		idx      : Number,
		name     : String,
		email    : String,
		picture  : String,
		birthday : String,
		password : String,
		phone       : String,
		facebook_id : String,
		facebook_accesstoken : String
	},{
		id : "idx",
		methods : {
			getFriends : function(callback){
				Friendship.find({user1_idx : this.idx},function(err,friendships){
					if(err) callback(err,null);
					
					var friends = [];
					friendships.forEach(function(v,k){
						friends.push(v.user2);
					});
					
					callback(null,friends);
				});
			},
			getParticipatingPapers : function(callback){
				RollingPaperTicket.find({
					user_idx : this.idx
				},function(err,tickets) {
					if(err) callback(err,null);
					
					var papers = [];
					tickets.forEach(function(v,k){
						if(v.paper.is_sended == "NONE")
							papers.push(v.paper);
					});
					
					callback(null,papers);
				});
			}
		}
	});
	
	var Friendship = db.define("FRIENDSHIP",{
		idx : Number,
		user1_idx : Number,
		user2_idx : Number
	},{
		id : "idx",
		methods : {
		
		}
	});
		
		
	RollingPaper.hasOne("creator",User);
	
	/*
	RollingPaper.hasMany("tickets",RollingPaperTicket,{
		paper_idx : Number
	});
	*/
	
	/*
	
	RollingPaper.find(function(err,papers){
		papers[0].getTickets(function(err,tickets){
			console.log(err);
			console.log(tickets);
		});
	});
	
	*/


	RollingPaperTicket.hasOne("user",User,{ autoFetch : true });
	RollingPaperTicket.hasOne("paper",RollingPaper,{ autoFetch : true });
	
	Friendship.hasOne("user1",User);
	Friendship.hasOne("user2",User,{ autoFetch : true });
    
    return cb();
};
