var fs = require("fs");
module.exports = function(content,io){
	var viewerRoom = "viewRoom";
	
	var lastScreenColor = null;
	io.of('/' + content.name).on('connection', function (socket) {
		if (lastScreenColor) {
			socket.emit("screen_color",lastScreenColor);
		}
	
		socket.on("screen_color",function(data){
			console.log("new Color : ", data);
			lastScreenColor = data;
			socket.broadcast.emit("screen_color",data);
		});
		socket.on('message', function (data) {
			console.log(data);
        });
	    socket.on('disconnect', function () {
			
        });
	}); 
};	