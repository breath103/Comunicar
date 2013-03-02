var http = require('http');
var options = {
    hostname: 'www.vingle.net',
	path: '/api/users/breath103/feed.json?count=100',
	port: '80',
	headers : {
		'user-agent' : "NODE.JS"
	}
};	

var req = http.request(options, function(response) {
	var str = ''
	response.on('data', function (chunk) {
		str += chunk;
        console.log(chunk);
	});
	response.on('end', function () {
		var results = JSON.parse(str);
		console.log(results.length);
    });
});
req.end();