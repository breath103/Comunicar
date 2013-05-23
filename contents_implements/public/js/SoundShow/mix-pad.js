$(document).ready(function(){
    var MixPadView = Parse.View.extend({
    	el: $("#touch-mix-pad"),
		events : {
			"click .recording-btn" : "toggleRecording",
	//		"touchstart .recording-btn" : "toggleRecording",
			"click .pad-thumbnail" : "onClickPad",
			"click .btn-mix-type" : "onChangeMixType"
		},
      	initialize: function() {
			_.bindAll(this,"onTouchStart","onTouchMove","onTouchEnd",
			               "onResize","onColorTapped","startRecording",
					   	   "stopRecording","toggleRecording","onClickPad","onChangeMixType");
			this.shouldDraw = false;
			this.isInRecording = false;
			this.canvas = this.$el.find("canvas");
			
			this.setCanvasImage("/img/spectrum.jpg");
			this.canvas.bind("touchstart mousedown",this.onTouchStart)
					   .bind("touchmove mousemove" ,this.onTouchMove)
					   .bind("touchend mouseup"	   ,this.onTouchEnd)
					   .resize(this.onResize);	   
					   
			$padBackgroundList = this.$el.find(".pad-background-list");
			
		},
		setCanvasImage : function(image_src) {
	    	this.palleteImage = new Image();
			this.palleteImage.onload = this.onResize;
			this.palleteImage.src = image_src;
		},
		onResize : function(){
			var context = this.canvas[0].getContext("2d");
			this.canvas[0].width   = this.canvas.width();
			this.canvas[0].height  = this.canvas.height();
			
			if(this.palleteImage){
				context.drawImage(this.palleteImage, 
								  0, 0, this.canvas.width(), this.canvas.height());
			}
		},
		onTouchStart : function(e){
        	e = e.originalEvent;
        	var touchPos = {
            	x : e.pageX - this.canvas.offset().left,
            	y : e.pageY - this.canvas.offset().top
        	};
			var color = this.getColorAtPos(touchPos);
			socket.emit("screen_color",{
				color : color
			});

			this.onColorTapped(color,e);
			this.shouldDraw = true;
			return false;			
		},
		getColorAtPos : function(pos){
	    	var context = this.canvas[0].getContext('2d');
			var color = context.getImageData(pos.x,pos.y, 1, 1).data;
			return "rgb("+color[0]+","+color[1]+","+color[2]+")";
		},
		onTouchMove : function(e) {
	        if(e && e.originalEvent && this.shouldDraw){
	        	e = e.originalEvent;
	        	var touchPos = {
	            	x : e.pageX - this.canvas.offset().left,
	            	y : e.pageY - this.canvas.offset().top
	        	};
				var color = this.getColorAtPos(touchPos);
				socket.emit("screen_color",{
					color : color
				});
				
				this.onColorTapped(color,e);
				return false;
	    	}
	    },
		onTouchEnd : function(e){
			this.shouldDraw = false;
		   	return false;
		},
		onColorTapped  : function(color,event){
			if(this.isInRecording){
				var track = this.recoding_track;
				var trackView = track.view;
				var patternListView = trackView.patternListView;
				
				if(this.lastColorEvent){
					time = event.timeStamp - this.lastColorEvent.event.timeStamp;
					switch (this.mix_type) {
						case "FadeTo" : {
							patternListView.createPatternWithType("FadeTo",{
								color : color,
								delay : 0,
								time  : time
							});
						}break; 
						case "Color" : {
							patternListView.createPatternWithType("Color",{
								color : color,
								delay : time
							});
						}break;
						case "RandomBlink" : {
				
						}break;
					}
					
				}
				
				this.colors.push({
					color : color,
					event : event
				});
				
				this.lastColorEvent = {
					color : color,
					event : event
				}
			}
		},
		toggleRecording : function(e){
			$button = $(e.currentTarget);
			if (this.isInRecording) {
				$button.html("Recording");
				this.stopRecording();
			} else {
				$button.html("Recording...");
				this.startRecording();
			}
		},
		onChangeMixType : function(e){
			var $button = $(e.currentTarget);
			var type = $button.html();
			
			this.mix_type = type;
			console.log(this.mix_type);
			switch (type) {
				case "FadeTo" : {
				
				}break; 
				case "Color" : {
					
				}break;
				case "RandomBlink" : {
				
				}break;
			}
		},
		startRecording : function(){
			this.isInRecording = true;
			this.colors = [];
			this.lastColorEvent = null;
			
			var self = this;
			window.trackListView.onClickAddNew(function(track){
				console.log(track);
				self.recoding_track = track;
			});
			
			console.log("Start recording");
		},
		stopRecording : function(){
			this.isInRecording = false;

			// var self = this;
			// var track = this.recoding_track;
			// var trackView = track.view;
			// var patternListView = trackView.patternListView;
			// var previousTimestamp = null;
			// 
			// _.each(self.colors,function(node){
			// 	if(previousTimestamp){
			// 		node.time = node.event.timeStamp - previousTimestamp;
			// 	} else {
			// 		node.time = 1;
			// 	}
			// 	previousTimestamp = node.event.timeStamp;
			// 	patternListView.createPatternWithType("FadeTo",{
			// 		color : node.color,
			// 		delay : 0,
			// 		time  : node.time
			// 	});
			// });
			
			console.log("Stop recording");
		},
		onClickPad: function (e){
			var $div = $(e.currentTarget);
			var src = $div.find("img").attr("src");
			this.setCanvasImage(src);
		}
    });	
		
	window.mixPadView = new MixPadView();
});