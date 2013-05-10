var fs = require("fs");
module.exports = function(content,io){
	var viewerRoom = "viewRoom";
	
	io.of('/' + content.name).on('connection', function (socket) {
		socket.on("screen_color",function(data){
			console.log("new Color : ", data);
			socket.broadcast.emit("screen_color",data);
		});
		socket.on('message', function (data) {
			console.log(data);
        });
	    socket.on('disconnect', function () {
			
        });
	}); 
};	