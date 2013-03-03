
module.exports = function(io,callback){
	
	
	var viewerRoom = "viewRoom";
	
	io.of('/Comunicar').on('connection', function (socket) {
		socket.on('message', function (data) {
			console.log(data);
        });
        socket.on('disconnect', function () {
    
        });
        socket.on('uploadImage',function(data){
        	console.log(data);
        	socket.broadcast.to(viewerRoom).emit("newImage",data);
        });
        
        socket.on("joinViewRoom",function(data){
        	socket.join(viewerRoom);
        });
    });
};	