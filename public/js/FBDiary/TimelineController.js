
function TimelineController(){
    this.$container = $(".vertical-timeline");
    this.$indicator = $(".vertical-timeline .indicator");
    this.$timeTags  = $(".vertical-timeline .time-tag");
}
TimelineController.prototype = {
    _timeToVerticalPos : function(time){
        if( !(time instanceof Date) )
            throw "unexpected time type " + typeof(time);
        else {
            var daySeconds = (time.getTime() + moment().zone() * 60 * 1000) % (60 * 60 * 24 * 1000);
            var verticalPos = daySeconds / (60 * 60 * 24 * 1000);
            return verticalPos;
        }
    },
    setCurrentTime : function(time){
        this.$indicator.transit({
            "top" : this._timeToVerticalPos(time) * 100 + "%"
        });
    },
    addTimeTag : function(time){
        var verticalPos = this._timeToVerticalPos(time);
        var $tag = $("<div class='time-tag'></div>");
        $tag.css({
            "top":verticalPos*100+"%"
        });
        this.$container.append($tag);
        this.$timeTags = this.$container.children(".time-tag");
    },
    removeAllTimeTags : function() {
        $(".vertical-timeline .time-tag").fadeOut(function(){
            $(this).remove();
        });
        this.$timeTags = null;
    },
    getTimeTags : function(){
        return this.$timeTags;
    },
    hideIndicator : function(){
        this.$indicator.transit({"opacity" : 1.0});
    },
    showIndicator : function(){
        this.$indicator.transit({"opacity" : 0.0});
    }
};