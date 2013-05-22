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
		className: "Pattern",
		getPlayTime : function(){
			var p = new Patterns[this.get("type")](JSON.parse(this.get("data")));
			return p.getPlayTime();
		}
	});
	var PatternList = Parse.Collection.extend({
		model: Pattern,
	    nextOrder: function() {
	    	if (!this.length) return 1;
	    	return this.last().get('order') + 1;
	    },
	    comparator: function(pattern) {
	    	return pattern.get('order');
	    },
		getPlayTime : function(){
			var time = 0;
			this.each(function(p){
				time += p.getPlayTime();
			});
			return time;
		},
		toJSON : function(){
			return _.map(this.models, function(model){ 
				return {
					type : model.get("type"),
					data : model.get("data")
				};
			});
		}
	});
	var SubPatternViews = {
		"Color" : Parse.View.extend({
	    	tagName : "div",
			className : "Color",
	     	template: _.template($('#Pattern-Color-template').html()),
			events: {
			},
		  	initialize: function() {
	        	_.bindAll(this, 'render','onClickColor');
	      		this.$el.html(this.template({e: this.getData()}));
				this.$el.click(this.onClickColor);
	      	},
			getData : function(){
				return JSON.parse(this.model.get("data"));
			},
			setData : function(data){
				this.model.set("data",JSON.stringify(data));
				this.model.save();
			},
	      	render: function() {
	        	this.$el.css({"background-color":this.getData().color});
	        	return this;
	      	},
			setColor : function(color) {
				var data = this.getData();
				data.color = color;
				this.setData(data);
			},
			onClickColor : function(e){
				var self = this;
				this.$el.colorpicker({
					'showCloseButton': true ,
					'inline': false,
					'showCancelButton': true ,
					close: function(event, color) {
						self.setColor("#" + color.formatted);
					}
				});
			}
		}),
		"FadeTo" : Parse.View.extend({
	    	tagName : "div",
			className : "FadeTo",
	     	template: _.template($('#Pattern-FadeTo-template').html()),
			events: {
				"change .time_input" : "onChange",
				"change .delay_input" : "onChange"
			},
		  	initialize: function() {
	        	_.bindAll(this, 'render','onClickColor','onChange');
				this.$el.click(this.onClickColor);
	      	},
			getData : function(){
				return JSON.parse(this.model.get("data"));
			},
			setData : function(data){
				this.model.set("data",JSON.stringify(data));
				this.model.save();
			},
			onChange : function(){
				var data = this.getData();
				data.time  = Number(this.$el.find(".time_input").val());
				data.delay = Number(this.$el.find(".delay_input").val());
				this.setData(data);
			},
			setColor : function(color) {
				var data = this.getData();
				data.color = color;
				this.setData(data);
			},
			onClickColor : function(e){
				var self = this;
				this.$el.find(".thumbnail").colorpicker({
					'showCloseButton': true ,
					'inline': false,
					'showCancelButton': true ,
					close: function(event, color) {
						self.setColor("#" + color.formatted);
					}
				});
			},
	      	render: function() {
	      		this.$el.html(this.template({e: this.getData()}));
			}
		}),
		"RandomBlink" : Parse.View.extend({
	    	tagName : "div",
			className : "RandomBlink",
	     	template: _.template($('#Pattern-RandomBlink-template').html()),
			events: {
				"change .interval_input" : "onChange",
				"change .delay_input" 	 : "onChange",
				"click .add-new-color" : "onAddNewColor"
			},
			initialize: function() {
	        	_.bindAll(this, 'render','onAddNewColor','onChange','addColor');
			},
			getData : function(){
				return JSON.parse(this.model.get("data"));
			},
			setData : function(data){
				this.model.set("data",JSON.stringify(data));
				this.model.save();
			},
			onChange : function(){
				var data = this.getData();
				data.interval = Number(this.$el.find(".interval_input").val());
				data.delay 	  = Number(this.$el.find(".delay_input").val());
				this.setData(data);
			},
			setColorAtIndex : function(color,index){
				var data = this.getData();
				data.colors[index] = color;
				this.setData(data);
			},
			onAddNewColor : function(){
				var newColor = "yellow";
				var $color = $('<div class="Color"></div>');
				$color.css({"background-color":newColor});
				this.$el.find(".Colors").append($color);
				$color.colorpicker({
					'showCloseButton': true ,
					'inline': false,
					'showCancelButton': true ,
					close: function(event, color) {
						$(this).css({"background-color":"#" + color.formatted});
					}
				});
				this.addColor(newColor);
			},
			addColor : function(color) {
				var data = this.getData();
				if(!data.colors)
					data.colors = [];
				data.colors.push(color);
				this.setData(data);
			},
	      	render: function() {
				var self = this;
				
	      		this.$el.html(this.template({e: this.getData()}));
				this.$el.find(".Color").colorpicker({
					'showCloseButton': true ,
					'inline': false,
					'showCancelButton': true ,
					close: function(event, color) {
						$(this).css({"background-color":"#" + color.formatted});
						self.setColorAtIndex("#" + color.formatted, Number($(this).attr("index")));
					}
				});
			}
		}),
		"BaseBlink" : Parse.View.extend({
	    	tagName : "div",
			className : "BaseBlink",
	     	template: _.template($('#Pattern-BaseBlink-template').html()),
			events: {
				"change .interval_input" : "onChange",
				"change .delay_input" 	 : "onChange",
				"change .range_input"    : "onChange"
			},
			initialize: function() {
	        	_.bindAll(this, 'render','onChange','setColor');
			},
			getData : function(){ return JSON.parse(this.model.get("data")); },
			setData : function(data){
				this.model.set("data",JSON.stringify(data));
				this.model.save();
			},
			onChange : function(){
				var data = this.getData();
				data.interval = Number(this.$el.find(".interval_input").val());
				data.delay 	  = Number(this.$el.find(".delay_input").val());
				data.range    = this.$el.find(".range_input").val();
				this.setData(data);
			},
			setColor : function(color){
				var data = this.getData();
				data.color = color;
				this.setData(data);
			},
	      	render: function() {
				var self = this;
	      		this.$el.html(this.template({e: this.getData()}));
				this.$el.find(".Color").colorpicker({
					'showCloseButton': true,
					'inline': false,
					'showCancelButton': true ,
					close: function(event, color) {
						$(this).css({"background-color":"#" + color.formatted});
						self.setColor("#" + color.formatted);
					}
				});
			}
		})
	}
    var PatternView = Parse.View.extend({
    	tagName: "div",
		className: 'pattern',
     	template: _.template($('#pattern-template').html()),
     	events: {
        	"click .delete-btn" : "delete"
      	},
      	initialize: function() {
        	_.bindAll(this, 'render', 'close', 'delete');
        	this.model.bind('change',  this.render);
			$(this.el).html( this.template({ e:this.model.toJSON() }) );
			
			this.actualView = new SubPatternViews[this.model.get("type")]( {model : this.model} );
			this.actualView.render();
			this.$el.prepend(this.actualView.$el);
		},
      	render: function() {
			this.actualView.render();
			return this;
      	},
	    close: function() {
			if(this.parentTrackView) {
			} else {
				this.model.save();
			}
		},
      	delete: function() {
			var self = this;
			this.$el.fadeOut(function(){
	      		self.model.destroy();
      		});
		}
    });	
    var PatternListView = Parse.View.extend({
    	tagName : "div",
		className : 'pattern_list_container',
     	template : _.template($('#pattern_list_template').html()),
		events : {
			"click .new-pattern" : "newPattern"
		},
		initialize: function() {
        	this.track = this.options.track;
			
		    _.bindAll(this, 'addOne', 'addAll', 'render','newPattern');
	        this.patternList = new PatternList();
			
	        this.patternList.query = new Parse.Query(Pattern);
			this.patternList.query.equalTo("track", this.track);
			this.patternList.bind('add',   this.addOne);
	        this.patternList.bind('reset', this.addAll);
	        this.patternList.bind('all',   this.render);
			this.patternList.fetch();
			
			this.$el.html(this.template());
        },
	    addOne: function(pattern) {
			var view = new PatternView({model: pattern});
	    	this.$el.find(".pattern_list").append(view.render().el);
	    },
		addAll: function(collection, filter) {
			this.patternList.each(this.addOne);
	    },
		render : function() {
        },
		createPatternWithType : function(type,data){
			if (type == "Color") { 
				return this.patternList.create({
					type : type,
					data : JSON.stringify(data?data:{
						color:"red",
						delay:1000
					}),
					track : this.track,
					order : this.patternList.nextOrder()
				});
			} else if (type == "RandomBlink") {
				return this.patternList.create({
					type : type,
					data : JSON.stringify(data?data:{
						colors:null,
						delay:1000,
						interval:100
					}),
					track : this.track,
					order : this.patternList.nextOrder()
				});
			} else if (type == "BaseBlink") {
				return this.patternList.create({
					type : type,
					data : JSON.stringify(data?data:{
						color: "#ff00ee",
						delay: 1000,
						interval: 100,
						range : 10
					}),
					track : this.track,
					order : this.patternList.nextOrder()
				});
			} else if (type == "FadeTo") {
				return this.patternList.create({
					type : type,
					data : JSON.stringify(data?data:{
						color : "black",
						delay : 1000,
						time  : 1000
					}),
					track : this.track,
					order : this.patternList.nextOrder()
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
    var TrackListView = Parse.View.extend({
    	el: $("#track_list"),
		initialize: function() {
			var self = this;
		    _.bindAll(this, 'addOne', 'addAll', 'render','onClickAddNew','onKeydown');
	        this.trackList = new TrackList();
			this.trackList.query = new Parse.Query(Track);
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
			var track = new Track();
			track.save().then(function(gameTurnAgain) {
				self.trackList.add(track);
				if(saveCallback) saveCallback(track);
			}, function(error) {
				if(failureCallback) failureCallback(error);
				alert("fail to make new track");
			});
		}
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
			window.trackListView = new TrackListView();
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