// USER
module.exports = function(app) {
    console.log("       --USERS--");


    var User = app.db.models.User;


    app.get("/api/users.json", function(req, res, next) {
        User.all(function(err, users) {
            if (err) next(err);
            else res.json(users);
        });
    });

    app.get("/api/users/:id([0-9]+).json", 
    		User.findWithId, 
    		function(req, res) {
        res.json(req.user);
    });


    console.log("       --USERS END--");
}