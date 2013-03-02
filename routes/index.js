
module.exports = function(app){
    console.log("--ROUTES--");
    
    require("./api")(app);
    require("./site")(app);
    
    console.log("--ROUTES END--");
}