var Schema = require('jugglingdb').Schema;
var schema = new Schema('mysql', {
    host : "210.122.0.119",
    database : "Comunicar",
    username : "root",
    password : "1234"
});

module.exports = function(callback) {
    
    var User = schema.define('User', {
        id       : {type : Number , index : true},
        name     : {type : String},
        password : {type : String},
        email    : {type : String}
    });

    
    var Content = schema.define('Content',{
        id        : {type : Number , index : true},
        name      : {type : String},   
        latitude  : {type : Number},
        longitude : {type : Number},
        min_player_count : {type:Number},
        max_player_count : {type:Number}
    });


    User.hasMany(Content, {as: 'contents',foreignKey: 'ownerId'});
    Content.belongsTo(User, {as: 'onwer', foreignKey: 'ownerId'});

    //for EXPRESS //
    User.prototype.getFindingMiddleware = function(condition){
        
    };
    
    
    User.login = function(user, callback) {
        console.log(user);
        User.findOne({where: user},function(err, user) {
        	if(err) 
        		callback(err,null);
            else{
	    	   	callback(null,user);
            } 
        });
    };
    

    callback(null,schema);
}
