var fs = require("fs");
module.exports = function(content,io,Question){
	var viewerRoom = "viewRoom";
	
	io.of('/' + content.name ).on('connection', function (socket) {
		socket.on('message', function (data) {
        });
        socket.on('disconnect', function () {
    
        });
		socket.on("add_question",function(data){
			console.log(data);
			socket.broadcast.to(viewerRoom).emit("add_question",data);

			var question = new Question(data.question);
			console.log(question);
			question.save(function(err,t){
				console.log("save",err,t);
			});
			// 
	        // facebookUser.findOne( { facebook_id : req.param("id") },function(err,user){
	        //     if(err) { res.send(401); }
	        //     console.log(user);
	        //     if (!user) {
	        //         user = new facebookUser();
	        //         user.facebook_id = req.param("id");
	        //     }
	        //     user.name  	 = req.param("name");
	        //     user.link  	 = req.param("link");
	        //     user.email	 = req.param("email");
	        //     user.picture = req.param("picture").data.url;
	        //     user.last_use_date = new Date();
	        //     user.visit_count++;
	        //     user.save();
	        //     res.send(200);
	        // });
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