
function TimelineController(){
    this.$container = $(".vertical-timeline");
    this.$indicator = $(".vertical-timeline .indicator");
    this.$timeTags  = $(".vertical-timeline .time-tag");
}
TimelineController.prototype = {
    _timeToVerticalPos : function(t){
        var time = null;
        if(_.isDate(t))
            time = moment(t);
        else if(_.isString(t))
            time = moment(t);
        else
            throw "unexpected time type " + typeof(t);

        var daySeconds  = time.hours() * 60 * 60 + time.minute() * 60 + time.second();
        var verticalPos = daySeconds / (60 * 60 * 24);
        return verticalPos * 0.96 + 0.02;
    },
    setCurrentTime : function(time){
        this.$indicator.clearQueue().transit({
            "top" : this._timeToVerticalPos(time) * 100 + "%"
        });
    },
    addTimeTag : function(time,tag_id){
        var self = this;
        var verticalPos = this._timeToVerticalPos(time);
        var $tag = $("<div class='time-tag'><a></a></div>");
        $tag.attr("tag_id",tag_id);
        $tag.css({
            "top":verticalPos*100+"%"
        });
        $tag.click(function(){
            self.setCurrentTime(time);
        });

        this.$container.append($tag);

        this.$timeTags = this.$container.children(".time-tag");

        return $tag;
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
        this.$indicator.transit({"opacity" : 0.0},0.2);
    },
    showIndicator : function(){
        this.$indicator.transit({"opacity" : 1.0},0.2);
    }
};