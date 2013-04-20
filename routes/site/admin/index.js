var fs = require("fs");
var mongoose = require("mongoose");

module.exports = function(app){
    console.log("       --ADMIN--");

    mongoose.connect("mongodb://localhost/Comunicar");
    var Schema = mongoose.Schema
        , ObjectId = Schema.ObjectId;
    var facebookUser = new Schema({
        facebook_id : String,
        name : String,
        link : String,
        picture : String,
        last_use_date : Date
    });
    facebookUser = mongoose.model('facebookUser', facebookUser);
    console.log(facebookUser);

    app.post("/admin/facebook_users",function(req,res){
        facebookUser.findOne({facebook_id:"100002717246207"},function(err,user){
            if(err) { res.send(401); }
            if (!user) {
                user = new facebookUser();
                user.facebook_id = req.param("id");
                res.send(200);
            }
            user.name = req.param("name");
            user.link = req.param("link");
            user.email = req.param("email");
            user.picture = req.param("picture").data.url;
            user.last_use_date = new Date();
            user.save();
            res.send(200);
        });

    });

    app.get("/admin/facebook_users",function(req,res){
        facebookUser.find({},function(err,users){
            if(err){
                res.send(401);
            } else {
                console.log(users);
                res.render("admin/facebook_users",{users:users});
            }
        });
    });

    console.log("       --ADMIN END--");
};