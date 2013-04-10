var fs = require("fs");

module.exports = function(app){
    console.log("   --SITES--");
    
    app.get("/",function(req,res){
        res.render("FBdiary",{
            title : "RollingPaper"
        }); 
    });

    var facebook_users = JSON.parse(fs.readFileSync("facebook_user_list.json"));
    if(!facebook_users)
        facebook_users = {};

    app.post("/users",function(req,res){
        facebook_users[req.param("facebook_id")] = new Date();
        fs.writeFile("facebook_user_list.json",JSON.stringify(facebook_users),function(){

        });
        res.send(200);
    });
    app.get("/facebook_user_list.json",function(req,res){
        res.json(200,facebook_users);
    });
    
    require("./auth")(app);
    require("./users")(app);
    require("./contents")(app);

    console.log("   --SITES END--");
};