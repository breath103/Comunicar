var fs = require("fs");

module.exports = function(app){
    console.log("   --SITES--");
    
    app.get("/",function(req,res){
        res.render("FBdiary",{
            title : "RollingPaper"
        }); 
    });

    require("./auth")(app);
    require("./users")(app);
    require("./contents")(app);
    require("./admin")(app);

    console.log("   --SITES END--");
};