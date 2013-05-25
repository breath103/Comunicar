$(function(){
	var User = Parse.Object.extend("User", {
	});
	
    var LoginView = Parse.View.extend({
    	el: $("#login_view"),
		initialize: function() {
			_.bindAll(this,"onLoginFailed","onLoginSuccess");
        },
     	events: {
        	"click .login-btn" : "onClickLogin"
      	},
		onLoginFailed : function(user,error){
			alert("failed to login : " + JSON.stringify(error));
		},
		onLoginSuccess : function(user){
//			window.trackListView = new TrackListView();
			this.$el.fadeOut();
		},
		onClickLogin : function(){
			var id 		 = this.$el.find(".id-input").val();
			var password = this.$el.find(".password-input").val();
			if (id && password) {
			    Parse.User.logIn(id,password, {
			    	success : this.onLoginSuccess,
					error   : this.onLoginFailed
			    });
			} else {
				alert("id or password is not filled");
			}
		}
	});

	var loginView = new LoginView();
	loginView.$el.find(".id-input").val("admin");
	loginView.$el.find(".password-input").val("admin");
	loginView.onClickLogin();	
});