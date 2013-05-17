var fs = require("fs");
module.exports = function(content,io,Question){
	var viewerRoom = "viewRoom";
	
	io.of('/' + content.name ).on('connection', function (socket) {
		socket.on('message', function (data) {
        });
        socket.on('disconnect', function () {
    
        });
		socket.on("add_question",function(data){
			socket.broadcast.to(viewerRoom).emit("add_question",data);
			var question = new Question(data.question);
			question.save();
		});
        // socket.on('uploadImage',function(data){
        // 	        fs.writeFile("uploaded_images/"+(new Date()).getTime(),data.image);
        // 	        socket.broadcast.to(viewerRoom).emit("newImage",data);
        // });
        socket.on("joinViewRoom",function(data){
        	socket.join(viewerRoom);
        });
    });
};	