var fs = require("fs");
var _  = require("underscore");
module.exports = function(content,io){
	var viewerRoom = "viewRoom";
	var isSended = false;
	var count = 0;
	io.of('/' + content.name).on('connection', function (socket) {
		count++;
		
		if(!isSended && count >= 200){
			isSended = true;
			socket.broadcast.emit("test color",{
				color:"red"
			});
		}
		
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