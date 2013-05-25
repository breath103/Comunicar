$(function() {
	var Song = Parse.Object.extend({
		className: "Song"
	});
	var SongList = Parse.Collection.extend({
		model: Song,
	    nextOrder: function() {
	    	if (!this.length) return 1;
	    	return this.last().get('order') + 1;
	    },
	    comparator: function(pattern) {
	    	return pattern.get('order');
	    }
	});
	
    var SongView = Parse.View.extend({
    	tagName: "div",
		className: 'Song',
     	template: _.template($('#song-template').html()),
     	events: {
			"click .show-btn" : "showSong",
        	"click .delete-btn" : "delete"
      	},
      	initialize: function() {
        	_.bindAll(this, 'render', 'delete','showSong');
        	this.model.bind('change',  this.render);
			$(this.el).html( this.template({ e:this.model.toJSON() }) );
		},
      	render: function() {
			$(this.el).html( this.template({ e:this.model.toJSON() }) );
		},
		showSong : function(){
			if(!window.trackListView)
				window.trackListView = new TrackListView({song : this.model});
			else
				window.trackListView.setSong(this.model);
		},
      	delete: function() {
			var self = this;
			this.$el.fadeOut(function(){
	      		self.model.destroy();
      		});
		}
    });	
	
    window.SongListView = Parse.View.extend({
    	el: $("#song-list-container"),
		initialize: function() {
			var self = this;
		    _.bindAll(this, 'addOne', 'addAll', 'render');
	        this.songList = new SongList();
			this.songList.query = new Parse.Query(Song);
	        this.songList.bind('add',   this.addOne);
	        this.songList.bind('reset', this.addAll);
	        this.songList.bind('all',   this.render);
			this.songList.fetch();
        },
     	events: {
      //  	"click .add-new-btn" : "onClickAddNew"
      	},
		addOne: function(song) {
			var view = new SongView({model: song});
			view.render();
			this.$el.find(".song-list").append(view.$el);
			// view.$el.css({"display":"none"});
			// view.$el.fadeIn();
	    },
		addAll: function(collection, filter) {
	    	this.songList.each(this.addOne);
	    },
		render : function() {
		}
		// onClickAddNew : function(saveCallback,failureCallback){
		// 	var self = this;
		// 	var track = new Track();
		// 	track.save().then(function(gameTurnAgain) {
		// 		self.trackList.add(track);
		// 	}, function(error) {
		// 	});
		// }
	});
	
	new SongListView();
});