var fs = require("fs");
module.exports = function(app){
    console.log("       --ADMIN--");

    var facebook_users = JSON.parse(fs.readFileSync("logs/facebook_user_list.json"));
    if(!facebook_users)
        facebook_users = {};

    app.post("/admin/facebook_users",function(req,res){
        facebook_users[req.param("facebook_id")] = new Date();
        fs.writeFile("logs/facebook_user_list.json",JSON.stringify(facebook_users));
        res.send(200);
    });

    app.get("/admin/facebook_users",function(req,res){
        res.render("admin/facebook_users",{users:facebook_users});
    });

    console.log("       --ADMIN END--");
};