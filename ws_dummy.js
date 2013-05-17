var _ = require("underscore");
	
var clientCount = 500;
var interval = 20;
var response = {
	"screen_color" : []
};


var connectedClientCount = 0;

function connectNew(){
	var io = require('socket.io-client');
	var socket = io.connect("http://www.fbdiary.net/SoundShow",{'force new connection': true});
	socket.on('connect', function(){
		console.log("current client : ",++connectedClientCount);
		socket.on("screen_color",function(data){
			response["screen_color"].push(new Date());
			console.log(response["screen_color"].length);
			if (response["screen_color"].length >= clientCount - 1) {
				var array = response["screen_color"];
				var min = _.min(array); 
				var max = _.max(array);
				var totalTime = 0;
				_.each(array,function(v){
					totalTime += v.getTime();
				});
				var avg = new Date(totalTime/array.length);
				console.log("min ",min);
				console.log("max ",max);
				console.log("avg ",avg);
			}
		});
		socket.on('event', function(data){
			console.log(data);
		});
		socket.on("message",function(data){
			console.log(data);
		});
		socket.on('disconnect', function(){
		});
	});	
};

for(var i=0;i<clientCount;i++){
	setTimeout(connectNew,interval * i);
}

