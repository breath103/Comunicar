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
			"click .duplicate-btn"    : "createCopy",
			"change .hotkey-input" 	  : "onHotkeyChange"
		},
      	initialize: function() {
			_.bindAll(this, 'render', 'close', 'play','addPattern','createCopy');
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
			
			if( (window.trackLoopPlayHandle && window.currentTrack != this) ) 
		   //     ( loop= && window.currentTrack == this))
			{
				console.log(window.trackLoopPlayHandle);
				clearInterval(window.trackLoopPlayHandle);
				window.trackLoopPlayHandle = null;
				window.currentTrack = null;
			}
			 
			if(loop){
				console.log(window.trackLoopPlayHandle);
				clearInterval(window.trackLoopPlayHandle);
				window.trackLoopPlayHandle = null;
				window.currentTrack = null;
				
				
				var playTime = this.patternListView.patternList.getPlayTime();
				window.trackLoopPlayHandle = setInterval(this.play,playTime + 1);
				window.currentTrack = this;
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
      	},
		createCopy : function(){
			var self = this;
			window.trackListView.onClickAddNew(function(track){
				self.patternListView.patternList.each(function(pattern){
					var newPattern = new Pattern({
						type  : pattern.get("type"),
						data  : pattern.get("data"),
						order : pattern.get("order"),
						track : track
					});
					newPattern.save();
				});
			})
		}
    });
	
    window.TrackListView = Parse.View.extend({
    	el: $("#track_list"),
     	events: {
        	"click .add-new-btn" : "onClickAddNew"
      	},
		initialize: function() {
			var self = this;
		    _.bindAll(this, 'addOne', 'addAll', 'render','onClickAddNew','onKeydown');
			
        	this.song = this.options.song;
			
			this.setSong(this.song);
			$("body").keydown(this.onKeydown);
        },
		setSong : function(song){
			$("#track_list").children(".track").remove();
	        this.trackList = new TrackList();
			this.trackList.query = new Parse.Query(Track);
			this.trackList.query.equalTo("song", song);
			this.trackList.bind('add',   this.addOne);
	        this.trackList.bind('reset', this.addAll);
	        this.trackList.bind('all',   this.render);
			this.trackList.fetch();
		},
		
		onKeydown : function(e){
			console.log(e);
			var loop = e.shiftKey;
			this.trackList.each(function(track){
				if(track.get("hotkey") == e.keyCode){
//					console.log("play",e.keyCode,track);
					track.view.play(loop);
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