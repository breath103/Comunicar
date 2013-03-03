module.exports = function(app){
    console.log("   --SITES--");
    
    app.get("/",function(req,res){
        res.render("index",{
            title : "RollingPaper"
        }); 
    });
    
    require("./auth")(app);
    require("./users")(app);
    require("./contents")(app);

    console.log("   --SITES END--");
};