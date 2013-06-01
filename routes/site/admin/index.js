var fs 		 = require("fs");
var mongoose = require("mongoose");

module.exports = function(app){
    console.log("       --ADMIN--");

    mongoose.connect("mongodb://localhost/Comunicar");
    var Schema = mongoose.Schema
        , ObjectId = Schema.ObjectId;
    var FacebookUser = new Schema({
        facebook_id : String,
        name 		: String,
        link 		: String,
        picture 	: String,
        visit_count : {type: Number, default: 0},
        last_use_date : Date,
		posts_data : String
    });
	
	FacebookUser.statics.findByFacebookID = function(facebook_id,cb){
    	return FacebookUser.findOne( { 'facebook_id' : facebook_id },cb);
	}
	FacebookUser.statics.middleware = {
		findByFacebookID : function(req,res,next) {
			FacebookUser.findByFacebookID(req.param("facebook_id"),function(err,user){
				if (err) {	
					next(err);
				} else if (!user){
					next(new Error("there is no facebook user with facebook_id : ",req.param("facebook_id")));
				} else {
					req.facebook_user = user;
					next();
				}
			});
		}
	};
	
	FacebookUser = mongoose.model('FacebookUser', FacebookUser);
	
    app.post("/admin/facebook_users",function(req,res){
        FacebookUser.findOne( { facebook_id : req.param("id") },function(err,user){
            if(err) { res.send(401); }
            if (!user) {
                user = new FacebookUser();
                user.facebook_id = req.param("id");
            }
            user.name  	 = req.param("name");
            user.link  	 = req.param("link");
            user.email	 = req.param("email");
            user.picture = req.param("picture").data.url;
            user.last_use_date = new Date();
            user.visit_count++;
            user.save();
			
            res.json(200,user.toJSON());
        });
    });
	
	
	
	app.post("/facebook_users/:facebook_id",FacebookUser.middleware.findByFacebookID,function(req,res){
		req.facebook_user.posts_data = req.param("posts_data");
		req.facebook_user.save(function(err){
			if (err) {
				res.send(501);
			} else {
				res.send(200);
			}
		});
	});
	
	app.get("/facebook_users/:facebook_id",FacebookUser.middleware.findByFacebookID,function(req,res){
		res.json( req.facebook_user.toJSON() );
	});

    app.get("/admin/facebook_users",function(req,res){
        FacebookUser.find({},function(err,users){
            if(err){
                res.send(401);
            } else {
                res.render("admin/facebook_users",{users:users});
            }
        });
    });

    console.log("       --ADMIN END--");
};