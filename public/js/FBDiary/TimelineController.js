
function TimelineController(){
    this.$container = $(".vertical-timeline");
    this.$indicator = $(".vertical-timeline .indicator");
    this.$timeTags  = null;
}
TimelineController.prototype = {
    _timeToVerticalPos : function(time){
        var daySeconds = (time.getTime() + moment().zone() * 60 * 1000) % (60 * 60 * 24 * 1000);
        var verticalPos = daySeconds / (60 * 60 * 24 * 1000);
        return verticalPos;
    },
    setCurrentTime : function(time){
        if( !(time instanceof Date) )
            throw "unexpected time type " + typeof(time);
        else {
            this.$indicator.transit({
                "top" : this._timeToVerticalPos(time) * 100 + "%"
            });
        }
    },
    addTimeTag : function(time){
        var verticalPos = this._timeToVerticalPos(time);
    },
    removeAllTimeTags : function() {

    },
    getTimeTags : function(){
        return this.$timeTags;
    }
};