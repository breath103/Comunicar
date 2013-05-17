var FacebookDiaryApp = function(){

    window.contentsManager = new FacebookContentsManager();
    window.diaryController = new DiaryController(contentsManager);

    var postLoadingEnded = function(){
        $(".Loading").fadeOut();
        diaryController.generateGraph();
        diaryController.showToday();
        onConnectFacebookEnd();
    }
    var onPostsStepLoaded = function(posts){
        var startDate = moment(_.first(posts).created_time)
        var endDate   = moment(_.last(posts).created_time)
        $(".Loading").html(
            $(".Loading").html() + "<br/>"
                + startDate.local().format("YYYY/MM/DD") + "부터 " + endDate.local().format("YYYY/MM/DD") + " 까지 데이터를 로딩중입니다...."
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
                $(".Loading").html("<h2>마지막 데이터 로딩 이후에 새로 추가된 페이스북 컨텐츠를 로딩 중입니다...</h2>");
                this.loadNewPosts(function(error,posts,stepCount,isLast){
                    if(error){ throw error; }

                    if(isLast){ postLoadingEnded(); }
                    else { onPostsStepLoaded(posts); }
                });
            }
            else {
                $(".Loading").html("<h2>초기 데이터를 로딩중입니다...</h2>");
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

