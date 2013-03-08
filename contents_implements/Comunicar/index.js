var fs = require("fs");
module.exports = function(params){	    
	console.log("!!!!!!!!");

	require("./websocket")(params.io);
	require("./routes")(params.app);    
	
    console.log("!!!!");
};	