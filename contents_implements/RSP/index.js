var socketIO = require("socket.io");

module.exports = function(app,callback){
	
	var io = socketIO.listen(app);
	io.sockets.on('connection', function (socket) {
    	socket.on('message', function (data) {
            console.info(data);
        });
        
        socket.on('disconnect', function () {
        
        });
    });
    
};	