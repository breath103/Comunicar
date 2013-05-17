var fs = require("fs");
module.exports = function(content,params){	    
	require("./websocket")(content,params.io);
	require("./routes")(content,params.app);    
};	