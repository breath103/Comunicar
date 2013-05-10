	
var clientCount = 200;
var interval = 50;
var response = {
	"test color" : []
};

var i = 0;

var connectNew = function(){
	var io = require('socket.io-client');
	var socket = io.connect("http://localhost:7777/SoundShow",{'force new connection': true});
	socket.on('connect', function(){
		socket.on("test color",function(data){
			response["test color"].push(new Date());
			console.log(response["test color"].length);
			if (response["test color"].length >= clientCount - 1) {
				var array = response["test color"];
				console.log(array);
				// for(var i=0;i<array.length;i++){
// 					var date = array[i];
// 				 	console.log(date);
// 				}
			}
		});
		socket.on('event', function(data){
			console.log(data);
		});
		socket.on("message",function(data){
			console.log(data);
		});
		socket.on('disconnect', function(){
//			console.log("disconnect");
		});
	});	
	if(i++ > clientCount){
		
	}	
};

for(var i=0;i<clientCount;i++){
	setTimeout(connectNew,interval * i);
}

