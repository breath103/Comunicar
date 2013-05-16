$(function() {
	_.templateSettings = {
		escape		: /<\?-([\s\S]+?)\?>/g,
		evaluate	: /<\?([\s\S]+?)\?>/g,
		interpolate : /<\?=([\s\S]+?)\?>/g
	};
	
	Parse.$ = jQuery;
 	Parse.initialize("PJbZN8uNbyIehnkz7VyY53RJG6rEVHdzKcCoUZYR", "9luQVvgoxvJ8XI7mJPP3jaqCrx0Oj8xgpTdigwck");
	var User = Parse.Object.extend("User", {
	});
	// Construct a query to get the current user's todo items
	var query = new Parse.Query(User);

	var Pattern = Parse.Object.extend({
		className: "Pattern"
	});
	var PatternList = Parse.Collection.extend({
		model: Pattern
	});
    var PatternView = Parse.View.extend({
    	tagName:  "div",
		className : 'pattern',
     	template: _.template($('#pattern-template').html()),
     	events: {
        	"click .delete-btn" : "delete"
      	},
      	initialize: function() {
        	_.bindAll(this, 'render', 'close', 'delete');
        	this.model.bind('change',  this.render);
      	},
      	render: function() {
        	$(this.el).html( this.template({ e:this.model.toJSON() }) );
        	return this;
      	},
	    close: function() {
	   	 	this.model.save();
	  	},
      	delete: function() {
			var self = this;
			this.$el.fadeOut(function(){
	      		self.model.destroy();
      		});
		}
    });

    var PatternListView = Parse.View.extend({
    	el: $("#pattern_list_container"),
		events : {
			"click .new-pattern" : "newPattern"
		},
		initialize: function() {
		    _.bindAll(this, 'addOne', 'addAll', 'render','newPattern');
	        this.patternList = new PatternList();
	        this.patternList.query = new Parse.Query(Pattern);
	        this.patternList.bind('add',   this.addOne);
	        this.patternList.bind('reset', this.addAll);
	        this.patternList.bind('all',   this.render);
			this.patternList.fetch();
        },
	    addOne: function(pattern) {
			var view = new PatternView({model: pattern});
	    	$("#pattern_list").append(view.render().el);
	    },
		addAll: function(collection, filter) {
	    	this.patternList.each(this.addOne);
	    },
		render : function() {
        },
		createPatternWithType : function(type){
			if (type == "Color") { 
				return this.patternList.create({
					type : type,
					data : JSON.stringify({
						color:"red",
						delay:1000
					})
				});
			} else if (type == "RandomBlink") {
				return this.patternList.create({
					type : type,
					data : JSON.stringify({
						colors:null,
						delay:1000,
						interval:100
					})
				});
			} else if (type == "FadeTo") {
				return this.patternList.create({
					type : type,
					data : JSON.stringify({
						color : "black",
						delay : 1000,
						time  : 1000
					})
				});
			}
		},
		newPattern : function(e){
			var type = $(e.target).html();
			var pattern = this.createPatternWithType(type);
		}
	});
	
	
	var Track = Parse.Object.extend({
		className: "Track"
	});
	// A Collection containing all instances of Pattern.
	var TrackList = Parse.Collection.extend({
		model: Track
	});

    var TrackView = Parse.View.extend({
    	tagName:  "div",
		className : 'track',
     	template: _.template($('#track-template').html()),
     	events: {
        	"click .play-btn" : "play",
			"click .delete-track-btn" : "delete"
		},
      	initialize: function() {
        	_.bindAll(this, 'render', 'close', /*'remove',*/'play','addPattern');
        	this.model.bind('change',  this.render);
//        	this.model.bind('destroy', this.remove);
      	},
      	render: function() {
        	var self = this;
			$(this.el).html( this.template({ e: this.model.toJSON() }) );
			_.each(this.model.get("patterns"),function(pattern){
				pattern = new Pattern(pattern);
				var view = new PatternView({model : pattern});
				view.render();
				$(self.el).find(".pattern_list").append($(view.el));
			});
			
        	return this;
      	},
	    close: function() {
	   	 	this.model.save();
	  	},
		addPattern : function(pattern) {
			this.model.add("patterns", JSON.stringify(pattern));
			this.render();
		},
		play : function() {
			window.socket.emit("play_track",{
				track: this.model.toJSON()
			});
		},
      	delete: function() {
			var self = this;
			this.$el.fadeOut(function(){
	      		self.model.destroy();
      		});
      	}
    });

    var TrackListView = Parse.View.extend({
    	el: $("#track_list"),
		initialize: function() {
			var self = this;
		    _.bindAll(this, 'addOne', 'addAll', 'render','onClickAddNew');
	        this.trackList = new TrackList();

	        this.trackList.query = new Parse.Query(Track);
	        this.trackList.bind('add',   this.addOne);
	        this.trackList.bind('reset', this.addAll);
	        this.trackList.bind('all',   this.render);
			this.trackList.fetch();
        },
     	events: {
        	"click .add-new-btn" : "onClickAddNew"
      	},
		addOne: function(track) {
			var view = new TrackView({model: track});
			view.render();
			$("#track_list").append(view.$el);
			view.$el.css({"display":"none"});
			view.$el.fadeIn();
	    },
		addAll: function(collection, filter) {
	    	this.trackList.each(this.addOne);
	    },
		render : function() {
			
			
        },
		onClickAddNew : function(){
			console.log("add new Track");
	        this.trackList.create({
				//default pattern. show color
				patterns : [ {"data":"{\"color\":\"red\",\"delay\":1000}","type":"Color"} ]
				/*
	        	content: this.input.val(),
	        	order:   this.todos.nextOrder(),
	        	done:    false,
	        	user:    Parse.User.current(),
	        	ACL:     new Parse.ACL(Parse.User.current())
				*/
	        });
		}
	});
	

    Parse.User.logIn("admin", "admin", {
    	success: function(user) {
			console.log("success",user);
		},
		error: function(user, error) {
        	console.log("error",user,error);
		}
    });

	new PatternListView();
	new TrackListView();
//				Parse.history.start();
});