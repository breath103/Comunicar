
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
        $(".date_indicator").html(moment(this.currentDate).format("YYYY/MM/DD"));
    },
    getCurrentDate : function(){
        return this.currentDate;
    },
    moveDate : function(dateDelta){
        var currentDate = new Date(this.getCurrentDate());
        currentDate.setDate(currentDate.getDate()+dateDelta);
        this.showDay(currentDate);
    },
    showDay : function(date){
        var self = this;

        var delta = 0;
        if(this.getCurrentDate())
            delta = date.getTime() - this.getCurrentDate().getTime();

        this._setCurrentDate(date);

        var $page = $("<div class='date-page'></div>");

        if(delta > 0) {
            $(".site-container .date-page").transit({
                left : "-100%",
                opacity : 0
            },function(){
                $(this).remove();
            });
            $(".site-container").append($page);
            $page.css({left:"100%",opacity:0}).transit({
                left : "0%",
                opacity : 1
            });
        } else if (delta < 0) {
            $(".site-container .date-page").transit({
                left : "100%",
                opacity : 0
            },function(){
                $(this).remove();
            });
            $(".site-container").append($page);
            $page.css({left:"-100%",opacity:0}).transit({
                left : "0%",
                opacity : 1
            });
        } else {
            $(".site-container .date-page").transit({
                opacity : 0
            },function(){
                $(this).remove();
            });
            $(".site-container").append($page);
            $page.fadeIn();
        }

        /*if(date > 0)
        {
            $(".site-container .date-page").css({ transformOrigin: '0 0' })
                .transit({
                    perspective: "10000px",
                    rotateY: '-90deg'
                },500,"ease",function(){
                    $(this).remove();
                });
        } else if(date < 0){

        } else {

        }*/


        var posts = this.fbContentsManager.getPostsWithDate(date);
        _.each(posts,function(post,i){
            var $post = $(this.postPresenter.presentPost(post));
            $post.click(function(){
                if(self.fbContentsManager.clipPost(post.id)){
                    self.onClipPost(post);
                }
            });
            $page.append($post);
        },this);
    },
    showToday : function(){
        this.showDay(new Date());
    }
};
