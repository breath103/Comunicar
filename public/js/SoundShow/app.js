$(function() {
	_.templateSettings = {
		escape		: /<\?-([\s\S]+?)\?>/g,
		evaluate	: /<\?([\s\S]+?)\?>/g,
		interpolate : /<\?=([\s\S]+?)\?>/g
	};
	
	
	Parse.$ = jQuery;
	// Initialize Parse with your Parse application javascript keys
 	Parse.initialize("PJbZN8uNbyIehnkz7VyY53RJG6rEVHdzKcCoUZYR", "9luQVvgoxvJ8XI7mJPP3jaqCrx0Oj8xgpTdigwck");
	var User = Parse.Object.extend("User", {
	});
	// Construct a query to get the current user's todo items
	var query = new Parse.Query(User);


	var Pattern = Parse.Object.extend("Pattern");

	var PatternList = Parse.Collection.extend({
		model: Pattern
	});

    var PatternView = Parse.View.extend({
    	tagName:  "div",
     	template: _.template($('#pattern-template').html()),
     	events: {
        	"click .delete-btn" : "onDelete"
      	},
      	initialize: function() {
        	_.bindAll(this, 'render', 'close', 'remove');
        	this.model.bind('change',  this.render);
        	this.model.bind('destroy', this.remove);
      	},
      	render: function() {
        	$(this.el).html( this.template({ e:this.model.toJSON() }) );
        	return this;
      	},
	    close: function() {
	   	 	this.model.save();
	  	},
      	onDelete: function() {
      		this.model.destroy();
      	}
    });

    var PatternListView = Parse.View.extend({
    	el: $("#pattern_list"),
		initialize: function() {
			var self = this;
		
	        _.bindAll(this, 'addOne', 'addAll', 'render');
			// Create our collection of Todos
	        this.patternList = new PatternList;
	        // Setup the query for the collection to look for todos from the current user
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
        	"click .play-btn" : "play"
		},
      	initialize: function() {
        	_.bindAll(this, 'render', 'close', 'remove','play','addPattern');
        	this.model.bind('change',  this.render);
        	this.model.bind('destroy', this.remove);
      	},
      	render: function() {
        	$(this.el).html( this.template({ e: this.model.toJSON() }) );
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
      		this.model.destroy();
      	}
    });

    var TrackListView = Parse.View.extend({
    	el: $("#track_list"),
		initialize: function() {
			var self = this;
		    _.bindAll(this, 'addOne', 'addAll', 'render');
			// Create our collection of Todos
	        this.trackList = new TrackList();
	        // Setup the query for the collection to look for todos from the current user
	        this.trackList.query = new Parse.Query(Track);
	        this.trackList.bind('add',   this.addOne);
	        this.trackList.bind('reset', this.addAll);
	        this.trackList.bind('all',   this.render);
			this.trackList.fetch();
        },
	    addOne: function(track) {
			var view = new TrackView({model: track});
	    	$("#track_list").append(view.render().el);
	    },
		addAll: function(collection, filter) {
	    	this.trackList.each(this.addOne);
	    },
		render : function() {
        },
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