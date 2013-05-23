$(function() {
	var Track = Parse.Object.extend({
		className: "Track"
	});
	// A Collection containing all instances of Pattern.
	window.TrackList = Parse.Collection.extend({
		model: Track
	});
    window.TrackView = Parse.View.extend({
    	tagName:  "div",
		className: 'track',
		template: _.template($('#track-template').html()),
     	events: {
        	"click .play-btn" 		  : "play",
			"click .delete-track-btn" : "delete",
			"change .hotkey-input" 	  : "onHotkeyChange"
		},
      	initialize: function() {
			_.bindAll(this, 'render', 'close', 'play','addPattern');
        	this.model.bind('change',  this.render);
			this.model.view = this;
			this.$el.html(this.template({e:this.model.toJSON()}));
			
			var patternListView = new PatternListView({
        		track : this.model
        	});
			patternListView.render();
			this.patternListView = patternListView;
			this.$el.append(patternListView.$el);
      	},
      	render: function() {
	
			this.patternListView.render();
			return this;
      	},
	    close: function() {
			console.log(patterns);
	   	 	this.model.save();
	  	},
		addPattern : function(pattern) {
			this.model.add("patterns", JSON.stringify(pattern));
			this.render();
		},
		jsonForPlay : function(){
			var json = this.model.toJSON();
			json.patterns = this.patternListView.patternList.toJSON();
			return json;
		},
		onHotkeyChange : function(e){
			var hotkey =  $(e.currentTarget).val().charCodeAt(0);
			
			var val = $(e.currentTarget).val();
			$(e.currentTarget).val(  val.substr(val.length-1)  );
		 	this.model.set("hotkey",hotkey);
			this.model.save();
		},
		play : function(loop) {
			var b = this.$el.css("background-color");
			this.$el.transit({
				"background-color" : "red"
			}).transit({
				"background-color" : b
			});
			window.socket.emit("play_track",{
				track: this.jsonForPlay()
			});
			
			if(loop){
		//		var playTime = this.patternListView.patternList.getPlayTime();
		//		setTimeout(this.play,playTime + 1);
			}
		},
      	delete: function() {
			var self = this;
			if(confirm("Delete Track?")){
				this.$el.fadeOut(function(){
		      		self.patternListView.patternList.each(function(p){
						p.destroy();
		      		});
				
					self.model.destroy();
				});
			} else {
				
			}
      	}
    });
	
    window.TrackListView = Parse.View.extend({
    	el: $("#track_list"),
		initialize: function() {
			var self = this;
		    _.bindAll(this, 'addOne', 'addAll', 'render','onClickAddNew','onKeydown');
			
        	this.song = this.options.song;
			
	        this.trackList = new TrackList();
			this.trackList.query = new Parse.Query(Track);
			this.trackList.query.equalTo("song", this.song);
			this.trackList.bind('add',   this.addOne);
	        this.trackList.bind('reset', this.addAll);
	        this.trackList.bind('all',   this.render);
			this.trackList.fetch();
			
			$("body").keydown(this.onKeydown);
        },
     	events: {
        	"click .add-new-btn" : "onClickAddNew"
      	},
		onKeydown : function(e){
			this.trackList.each(function(track){
				if(track.get("hotkey") == e.keyCode){
					console.log("play",e.keyCode,track);
					track.view.play();
				}
			});
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
		onClickAddNew : function(saveCallback,failureCallback){
			var self = this;
			var track = new Track({
				song : this.song
			});
			track.save().then(function(gameTurnAgain) {
				self.trackList.add(track);
				if(_.isFunction(saveCallback)) saveCallback(track);
//				if(saveCallback) saveCallback(track);
			}, function(error) {
//				if(failureCallback) failureCallback(error);
				alert("fail to make new track");
			});
		}
	});
});