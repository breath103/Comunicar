var FacebookDiaryApp = function(){

    window.contentsManager = new FacebookContentsManager();
    window.diaryController = new DiaryController(contentsManager);

    var postLoadingEnded = function(){
        $(".Loading").fadeOut();
        diaryController.showToday();
        onConnectFacebookEnd();
    }
    var onPostsStepLoaded = function(posts){
        var startDate = new Date(_.first(posts).created_time);
        var endDate   = new Date(_.last(posts).created_time);
        $(".Loading").html(
            $(".Loading").html() + "<br/>" + startDate.format("yyyy/mm/dd") + "부터 " + endDate.format("yyyy/mm/dd") + " 까지 데이터를 로딩중입니다...."
        );
    }
    var onConnectFacebookEnd = function(){
        diaryController.presentClipedPosts();
    }

    try{
        contentsManager.connectFacebook(function(error,response){
            if (error) {}
            var posts = this.getCachedPosts();
            if (posts && posts.length > 0) {
                $(".Loading").html("마지막 데이터 로딩 이후에 새로 추가된 페이스북 컨텐츠를 로딩 중입니다...");
                this.loadNewPosts(function(error,posts,stepCount,isLast){
                    if(error){ throw error; }

                    if(isLast){ postLoadingEnded(); }
                    else { onPostsStepLoaded(posts); }
                });
            }
            else {
                $(".Loading").html("초기 데이터를 로딩중입니다...");
                this.loadAllPosts(function(error,posts,stepCount,isLast){
                    if (error) { throw error; }

                    if (isLast) {  postLoadingEnded(); }
                    else { onPostsStepLoaded(posts); }
                });
            }
        });
    }
    catch(e){
        alert(e);
    }
};

