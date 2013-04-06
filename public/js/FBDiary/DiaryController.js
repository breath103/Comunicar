
"use strict"
function DiaryController(contentsManager){
    this.fbContentsManager = contentsManager;
    this.postPresenter = new PostPresenter(this.fbContentsManager);
    this.currentDate = null;
}
DiaryController.prototype = {

    presentClipedPosts : function(){
        var self = this;
        _.each(self.fbContentsManager.getClipedPosts(),function(post_id,index){
            var post  = self.fbContentsManager.getPostWithID(post_id);
            self.onClipPost(post);
        });
    },
    /**
     * event handler for clip post
     * @param post
     */
    onClipPost : function(post){
        var self = this;

        var $post = $(this.postPresenter.presentPost(post));
        $post.click(function(){
            self.fbContentsManager.unclipPost(post.id);
            $(this).remove();
        });

        $(".clip-container").prepend( $post );
    },
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
        var self = this;
        this._setCurrentDate(date);

        var posts = this.fbContentsManager.getPostsWithDate(date);
        $(".site-container").children().fadeOut(function(){
            $(this).remove();
        });
        _.each(posts,function(post,i){
            var $post = $(this.postPresenter.presentPost(post));
            $post.click(function(){
                if(self.fbContentsManager.clipPost(post.id)){
                    self.onClipPost(post);
                }
            });
            $(".site-container").append($post);
        },this);
    },
    showToday : function(){
        this.showDay(new Date());
    }
};
