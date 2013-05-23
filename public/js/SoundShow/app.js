$(function() {
	_.templateSettings = {
		escape		: /<\?-([\s\S]+?)\?>/g,
		evaluate	: /<\?([\s\S]+?)\?>/g,
		interpolate : /<\?=([\s\S]+?)\?>/g
	};
	
	Parse.$ = jQuery;
 	Parse.initialize("PJbZN8uNbyIehnkz7VyY53RJG6rEVHdzKcCoUZYR", "9luQVvgoxvJ8XI7mJPP3jaqCrx0Oj8xgpTdigwck");

	var Pattern = Parse.Object.extend({
		className: "Pattern",
		getPlayTime : function(){
			var p = new Patterns[this.get("type")](JSON.parse(this.get("data")));
			return p.getPlayTime();
		}
	});
	window.PatternList = Parse.Collection.extend({
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
				"change .delay_input" : "onChange"
			},
		  	initialize: function() {
	        	_.bindAll(this, 'render','onClickColor','onChange');
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
			onChange : function(){
				var data = this.getData();
				data.delay = Number(this.$el.find(".delay_input").val());
				this.setData(data);
			},
			render: function() {
	      		this.$el.html(this.template({e: this.getData()}));
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
    window.PatternListView = Parse.View.extend({
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
});