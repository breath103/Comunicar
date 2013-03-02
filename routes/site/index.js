module.exports = function(app){
    console.log("   --SITES--");
    
    app.get("/",function(req,res){
        res.render("index",{
            title : "RollingPaper"
        }); 
    });
    
    console.log("   --SITES END--");
};