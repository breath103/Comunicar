
"use strict"
function DiaryController(contentsManager){
    this.fbContentsManager = contentsManager;
    this.postPresenter = new PostPresenter(this.fbContentsManager);
    this.postSearcher  = new PostSearcher(this.fbContentsManager);
    this.timelineController = new TimelineController();
    this.currentDate = null;

    this.query = null;
    this.searchResult = {};
    this.$searchInput = $("#search-input");

    var self = this;
                 /*
    this.$searchInput.bind("change focus",function(){
        if($(this).val() == "") {
            $(".site-container").clearQueue().fadeIn();
        }
        else {
            $(".site-container").clearQueue().fadeOut();
            self.showSearchResultMap($(this).val(),
                                     self.postSearcher.searchPost({query : $(this).val()}));
        }
    });
    $("#search-button").click(function(){
        if(self.$searchInput.val() == "") {
            $(".site-container").clearQueue().fadeIn();
        }
        else {
            $(".site-container").clearQueue().fadeOut();
            self.showSearchResultMap(self.$searchInput.val(),
                                     self.postSearcher.searchPost({query : self.$searchInput.val()}));
        }
    });
    */
}
DiaryController.prototype = {
    showSearchResultMap : function(query,searchResult){
     //   var datePairs = _.pairs(searchResult);
        var self = this;
        $(".search-result-view").children().remove();
        _.each(searchResult,function(v,k){
            var $div = $("<div class='result btn'></div>");
            $div.html(k + " : " + v.length);
            $(".search-result-view").append($div);
            $div.click(function(){
                $(".site-container").fadeIn();
                self.showDay(moment(k, "YYYY/MM/DD").toDate());
            });
        });
    },
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

        var $post = $(this.postPresenter.presentClipedPost(post));

        $post.click(function(){
            self.fbContentsManager.unclipPost(post.id);
            $(this).remove();
        });

        $(".clip-container").prepend($post);
    },
    _setCurrentDate : function(date){
        this.currentDate = date;
        $(".date_indicator").html(moment(this.currentDate).local().format("YYYY/MM/DD"));
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
            $(".post-container .date-page").transit({
                left : "-100%",
                opacity : 0
            },function(){
                $(this).remove();
            });
            $(".post-container").append($page);
            $page.css({left:"100%",opacity:0}).transit({
                left : "0%",
                opacity : 1
            });
        } else if (delta < 0) {
            $(".post-container .date-page").transit({
                left : "100%",
                opacity : 0
            },function(){
                $(this).remove();
            });
            $(".post-container").append($page);
            $page.css({left:"-100%",opacity:0}).transit({
                left : "0%",
                opacity : 1
            });
        } else {
            $(".post-container .date-page").transit({
                opacity : 0
            },function(){
                $(this).remove();
            });
            $(".post-container").append($page);
            $page.fadeIn();
        }
        var posts = this.fbContentsManager.getPostsWithDate(date);
        self.timelineController.removeAllTimeTags();
        if(posts && posts.length > 0){
            self.timelineController.showIndicator();
            self.timelineController.setCurrentTime(_.last(posts).created_time);
        } else {
            self.timelineController.hideIndicator();
        }
        _.each(posts,function(post,i){
            var $post = $(this.postPresenter.presentPost(post));
            self.timelineController.addTimeTag(post.created_time);
            $post.click(function(){
                console.log(post.created_time);
                console.log(moment(post.created_time).local().format("YYYY-MM-DD-HH-MM-SS"));
                self.timelineController.setCurrentTime(post.created_time);
                if(self.fbContentsManager.clipPost(post.id)){
                    self.onClipPost(post);
                }
            });
            $page.prepend($post);
        },this);
    },
    showToday : function(){
        this.showDay(new Date());
    }
};
