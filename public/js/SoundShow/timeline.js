$(document).ready(function(){
    var TimelineView = Parse.View.extend({
    	el: $("#timeline"),
		events : {},
      	initialize: function() {
			_.bindAll(this,"onKeydown");
			this.lastTimestamp = null;
			$("body").keydown(this.onKeydown);
		},
		onKeydown : function(e) {
			var str = String.fromCharCode(e.keyCode);
			if(str == "N" || str == "M"){
				if(this.lastTimestamp) {
					var elapsedTime = e.timeStamp - this.lastTimestamp;
					console.log(elapsedTime);n
					this.lastTimestamp = e.timeStamp;
				} else {
					this.lastTimestamp = e.timeStamp;
				}
			}
		}
    });	
		
	new TimelineView();
// OFFED
});