var fs = require("fs");
var mongoose = require("mongoose");
module.exports = function(content,params){	    
	
    var Schema   = mongoose.Schema, 
		ObjectId = Schema.ObjectId;
    var Question = new Schema({
		text : String
    });
    Question = mongoose.model('Question', Question);
	params.app.DAO = {
		"Question" : Question
	};
	
	if(Question) {
		console.log("TalkConcert moongoose db connected");
	}

	require("./websocket")(content,params.io,Question);
	require("./routes")(content,params.app);    
};	