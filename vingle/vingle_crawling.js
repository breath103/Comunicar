var http = require('http');
var fs   = require("fs");
var util = require("util");
var options = {
    hostname: 'www.vingle.net',
	path: '/api/users/breath103/feed.json?count=300',
	port: '80',
	headers : {
		'user-agent' : "NODE.JS"
	}
};	

var req = http.request(options, function(response) {
	
	var str = ''
	response.on('data', function (chunk) {
		str += chunk;
		console.log(str.length / 1463105 * 100);
		
    });
	response.on('end', function () {
		var results = JSON.parse(str);
		
		fs.writeFile("./feed.json",str,function(err, written, buffer){
			console.log("end");
			console.log(err,written,str.length);
		});
		
    });
});
req.end();