
module.exports = function(io,callback){
	
	var STATES = {
		WAITING_FOR_PLAYER : 0
	};
	
	var RSP = {
		ROCK 	: 0,
		SICCORS : 1,
		PAPER 	: 2
	}
	
	var state = STATES.WAITING_FOR_PLAYER;
	
	var server_select = RSP.ROCK;
	
	io.of("/RSP").on('connection', function (socket) {
		setTimeout(function(){
			socket.emit("SERVER_SELECT",{select : 1});
		}, 2000);
		
    	socket.on('message', function (data) {
            console.info(data);
        });
        socket.on('disconnect', function () {
        
        });
    });
    
};	