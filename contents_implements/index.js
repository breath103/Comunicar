

var socketIO = require("socket.io");


module.exports = function(app){
    console.log("	--CONTENTS_IMPLEMENTS--");

	var io = socketIO.listen(app);
    
    require("./Comunicar")(io);
    require("./RSP")(io);
    
    console.log("	--CONTENTS_IMPLEMENTS--");
}