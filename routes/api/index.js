
/*
 * GET home page.
 */

module.exports = function(app){
    console.log("   --API--");
    
    require("./users")(app);
    require("./papers")(app);
    
    console.log("   --API END--");
}