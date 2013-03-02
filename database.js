var Schema = require('jugglingdb').Schema;
var schema = new Schema('mysql', {
    host : "210.122.0.119",
    database : "Comunicar",
    username : "root",
    password : "1234"
});

module.exports = function(callback) {
    
    var User = schema.define('User', {
        idx      : {type : Number , index : true},
        name     : {type : String},
        password : {type : String},
        email    : {type : String}
    });

    //for EXPRESS //
    User.prototype.getFindingMiddleware = function(condition){
        
    };
    
    User.prototype.findWithId = function(req, res, next) {
        User.get(req.params.id, function(err, user) {
            if (err) next(err);
            else {
                req.user = user;
                next();
            }
        });
    };
    
    User.prototype.findWithName = function(req,res,next){
        User.find({ name : req.params.name }, function(err, users) {
            if (err) next(err);
            else {
                req.user = users[0];
                next();
            }
        });
    };
    
    User.prototype.login = function(user, callback) {
        console.log(user);
        User.find(user,function(err, users) {
            if(err) callback(err,null);
            else callback(null,users[0]);
        });
    };

    callback(null,schema);
}
