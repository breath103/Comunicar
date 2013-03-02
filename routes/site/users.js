var util = require("util");
module.exports = function(app) {
    console.log("       --USERS--");

    var User = app.db.models.User;
    
    User.checkAuth = function(req,res,next) {
        if(req.session.user){
            next();
        }
        else{
            res.redirect('/auth/login');
        }
    };
    
    app.get("/login",function(req,res,next){
        res.render("login",{});
    });
    
    app.post("/login", function(req, res, next) {
        var user = req.body.user;
        User.login(user, function(err, user) {
            if (err) {
                res.redirect("/login");
            }
            else {
                req.session.user = user;
                res.redirect("/" + user.name);
            }
        });
    });
    
    app.get("/signup",function(req,res,next){
        res.render("user/create");
    });

    app.post("/users", function(req, res, next) {
        console.log("++",req.body.user);
        User.create(req.body.user, function(err, user) {
            console.log("==",req.body.user);
            if (err) next(err);
            else {
                res.redirect("/login");
            }
        });
    });
    

    app.get("/:name",User.findWithName,function(req,res,next){
        if(req.user){
            next();
        } 
        else{
            next(new Error("there is no user Name " + req.param("name")));
        }
    });
    
    app.get("/:name",function(req,res){
        res.render("user/show",{
            user : req.user
        });     
    });

    console.log("       --USERS END--");
}