$(document).ready(function(){
    var MixPadView = Parse.View.extend({
    	el: $("#touch-mix-pad"),
		events : {},
      	initialize: function() {
			_.bindAll(this,"onTouchStart","onTouchMove","onTouchEnd","onResize");
			this.shouldDraw = false;
			this.canvas = this.$el.find("canvas");
			
			this.setCanvasImage("/img/spectrum.jpg");
			this.canvas.bind("touchstart mousedown",this.onTouchStart)
					   .bind("touchmove mousemove" ,this.onTouchMove)
					   .bind("touchend mouseup"	,this.onTouchEnd)
					   .resize(this.onResize);	   
		},
		setCanvasImage : function(image_src) {
	    	this.palleteImage = new Image();
			this.palleteImage.src = image_src;
			this.palleteImage.onload = this.onResize;
		},
		onResize : function(){
			var context = this.canvas[0].getContext("2d");
			this.canvas[0].width   = this.canvas.width();
			this.canvas[0].height = this.canvas.height();
			
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
				return false;
	    	}
	    },
		onTouchEnd : function(e){
			this.shouldDraw = false;
			console.log("end");
		   	return false;
		}
    });	
		
	new MixPadView();
});