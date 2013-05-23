function Track(){
	this.patterns = [];//data.patterns;
	this.currentIndex = 0;
	this.currentPattern = null;
	this.$div = null;
}
Track.prototype = {
	fromString : function(str){
		var o = JSON.parse(str);
		var self = this;
		this.patterns = [];
		_.each(o.patterns,function(v){
			self.patterns.push(   new window[v.type](JSON.parse(v.data))   );
		});
	},
	toString : function(){
		return JSON.stringify(this.toJSON());
	},
	run : function($div,cb){
		var self = this;
		self.$div = $div;
		var _runNextTrack = function(){
			if (self.currentIndex >= self.patterns.length) {
				self.stop();
				if(cb)
					cb();
			} else {
				self.currentPattern = self.patterns[self.currentIndex++];
				console.log(self.currentPattern);
				console.log("2",self.$div);
				self.currentPattern.run(self.$div,function(){
					_runNextTrack();
				});	
			}
		}	
		_runNextTrack();
	},
	stop : function($div){
		if($div)
			$div.clearQueue();
		if(this.currentPattern)
			this.currentPattern.onEnd($div);
		this.currentIndex 	= 0;
		this.currentPattern = null;
	}
};


function Pattern(){
		
}
Pattern.prototype = {
	toString : function(){},
	getPlayTime : function(){},
	run   	 : function($div,endCallback){},
	stop  	 : function($div){},
	onEnd 	 : function(){}
}


function FadeTo(data)
{
	this.time  = data.time;
	this.delay = data.delay;
	this.color = data.color;
}
FadeTo.prototype = Pattern.prototype;
FadeTo.prototype.constructor = FadeTo;
FadeTo.prototype = {
	toJSON : function(){
		return {
			type : "FadeTo",
			time  : this.time,
			delay : this.delay,
			color : this.color
		};
	},
	getPlayTime : function(){
		return this.time + this.delay;
	},
	run : function($div,endCallback){
		var self = this;
		self.isEnd = false;
		$div.clearQueue().transit({"background-color" : self.color},self.time,function(){
			if(!self.isEnd){
				self.endTimeoutHandle = setTimeout(function(){
					self.onEnd($div);
					endCallback();
				},self.delay);
				self.isEnd = false;
			}
		});
	},
	onEnd : function($div){
		var self = this;
		self.isEnd = true; 
		$div.clearQueue();
		clearTimeout(self.endTimeoutHandle);
	}
}



function Color(data)
{
	this.delay = data.delay;
	this.color = data.color;
}
Color.prototype = Pattern.prototype;
Color.prototype.constructor = Color;
Color.prototype = {
	toJSON : function(){
		return {
			type  : "Color",
			delay : this.delay,
			color : this.color
		};
	},
	getPlayTime : function(){
		return this.delay;
	},
	run : function($div,endCallback){
		var self = this;
		$div.css({
			"background-color" : this.color		
		});
		self.callbackHandle = setTimeout(function(){
			self.onEnd($div);
			endCallback();
		},self.delay);
	},
	onEnd : function(){
		clearTimeout(this.callbackHandle);
	}
};


function RandomBlink(data)
{
	this.interval = data.interval;
	this.colors   = data.colors;
	this.delay    = data.delay;
}
RandomBlink.prototype = Pattern.prototype;
RandomBlink.prototype.constructor = RandomBlink;
RandomBlink.prototype = {
	toJSON : function(){
		return {
			type     : "RandomBlink",
			interval : this.interval,
			colors   : this.colors,
			delay    : this.delay
		};
	},
	getPlayTime : function(){
		return this.delay;
	},
	run : function($div,endCallback){
		var self = this;
		self.blinkIntervalHandle = setInterval(function(){
			var color = null;
			var previousColor = $div.css("background-color");
			if(self.colors && self.colors.length > 0) { 
				var randomIndex = _.random(0,self.colors.length);
				color = self.colors[randomIndex];
				if(color == previousColor) {
					color = self.colors[(randomIndex + 1)%self.colors.length];
				}
			} else { 
				color = get_random_color(); 
			}
			$div.css("background-color",color);
		},self.interval);
		
		if (self.delay) {
			self.endHandle = setTimeout(function(){
				self.onEnd();
				endCallback();
			},self.delay);
		}
	},
	onEnd : function(){
		clearTimeout(this.endHandle);
		clearInterval(this.blinkIntervalHandle);
	}
};


function BaseBlink(data)
{
	this.interval = data.interval;
	this.delay    = data.delay;
	this.range    = data.range;
	this.color 	  = data.color;
}
BaseBlink.prototype = Pattern.prototype;
BaseBlink.prototype.constructor = BaseBlink;
BaseBlink.prototype = {
	toJSON : function(){
		return {
			type     : "BaseBlink",
			interval : this.interval,
			delay    : this.delay,
			range    : this.range,
			color 	 : this.color
		};
	},
	getPlayTime : function(){
		return this.delay;
	},
	run : function($div,endCallback){
		var self = this;
		self.blinkIntervalHandle = setInterval(function(){
			var parseColor = parseCSSColor(self.color);
			
			parseColor[0] += Math.round( (Math.random()-0.5) * Number(self.range));
			parseColor[1] += Math.round( (Math.random()-0.5) * Number(self.range));
			parseColor[2] += Math.round( (Math.random()-0.5) * Number(self.range));
			
			$div.css("background-color","rgb("+parseColor[0]+","+parseColor[1]+","+parseColor[2]+")");
		},self.interval);
		
		if (self.delay) {
			self.endHandle = setTimeout(function(){
				self.onEnd();
				endCallback();
			},self.delay);
		}
	},
	onEnd : function(){
		clearTimeout(this.endHandle);
		clearInterval(this.blinkIntervalHandle);
	}
};

Patterns = {
	FadeTo : FadeTo,
	Color : Color,
	RandomBlink : RandomBlink,
	BaseBlink : BaseBlink
};
