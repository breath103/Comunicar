

function DiaryController(contentsManager){
    "use strict"
    this.fbContentsManager = contentsManager;
    this.postPresenter = new PostPresenter(this.fbContentsManager);
    this.currentDate = null;
}
DiaryController.prototype = {
    _setCurrentDate : function(date){
        this.currentDate = date;
        $(".date_indicator").html(this.currentDate.format("yyyy/mm/dd"));
    },
    getCurrentDate : function(){
        return this.currentDate;
    },
    moveDate : function(dateDelta){
        this.currentDate.setDate(this.currentDate.getDate()+dateDelta);
        this.showDay(this.currentDate);
    },
    showDay : function(date){
        this._setCurrentDate(date);

        var posts = this.fbContentsManager.getPostsWithDate(date);
        $(".site-container").children().fadeOut(function(){
            $(this).remove();
        });
        _.each(posts,function(post,i){
            var $post = this.postPresenter.presentPost(post);
        //    console.log($post);
            $(".site-container").append($post);
        },this);
    },
    showToday : function(){
        this.showDay(new Date());
    }
};
