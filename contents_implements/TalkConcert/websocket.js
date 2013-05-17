var fs = require("fs");
module.exports = function(content,io){
	var viewerRoom = "viewRoom";
	io.of('/' + content.name ).on('connection', function (socket) {
		socket.on('message', function (data) {
			console.log(data);
        });
        socket.on('disconnect', function () {
    
        });
        socket.on('uploadImage',function(data){
	        fs.writeFile("uploaded_images/"+(new Date()).getTime(),data.image);
	        socket.broadcast.to(viewerRoom).emit("newImage",data);
        });
        socket.on("joinViewRoom",function(data){
        	socket.join(viewerRoom);
        });
    });
};	