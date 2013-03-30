
function FacebookContentsManager()
{
    this.posts = null;
    this.postCalendarMap = {};
}
FacebookContentsManager.prototype = {
    /**
     * @param callbacks = {
     *    success : Function(response)
     *    failure : Function(error)
     * }
     */
    connectFacebook : function(cb) {
        var self = this;

        var debug_app   = "358262920960112";
        var release_app = "333864290041286";
        FB.init({ "appId"  : debug_app,
                  "status" : true,
                  "cookie" : true,
                  "xfbml"  : true,
                  "oauth"  : true});

        var startFacebookLogin = function() {
            FB.login(function (response) {
                if (response.authResponse) {
                    cb.call(self,null,response);
                } else {
                    cb.call(self,new Error("facebook auth failed"));
                }
            }, {"scope": 'email,user_likes,read_stream'});
        };

        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                cb.call(self,null,response);
            } else if (response.status === 'not_authorized') {
                startFacebookLogin();
            } else {
                startFacebookLogin();
            }
        });
    },
    /***
     * @param posts : Array
     */
    setCachedPosts : function(posts){
        if(posts && posts.length > 0){
            localStorage.loaded_posts = JSON.stringify(posts);
            localStorage.latest_post  = JSON.stringify(_.first(posts));
        }
    },
    getCachedPosts : function(){
        if(localStorage.loaded_posts)
            return (this.posts = JSON.parse(localStorage.loaded_posts));
        else
            return (this.posts = []);
    },
    getLatestPost : function(){
        if(localStorage.latest_post)
            return JSON.parse(localStorage.latest_post);
        else
            return null;
    },
    clearCache : function(){
        localStorage.clear();
    },
    /**
     * @param cb : Function(error,posts,stepCount,isLastPosts)
     */
    loadNewPosts : function(cb){
        var self = this;
        var loadedPosts = self.getCachedPosts();
        var latest_post = self.getLatestPost();
        var loadCount = 0;

        var loadingPrevFBPostLoop = function(response){
            //새로운 포스트를 로딩하는 것이기 때문에 추가한뒤에 다시 날짜순으로 정렬한다.
            try{
                loadedPosts =  _.chain(loadedPosts)
                    .union(response.data)
                    .uniq(function(v){return v.id;})
                    .sortBy(function(v){return -(new Date(v.created_time)).getTime();})
                    .value();
            }

            catch(e){
                throw e;
            }

         //   _(response.data.reverse()).each(createPostDivAndPrepend);
            if (response.error){
                cb.call(self,new Error(response.error));
            }

            if (response.data && response.data.length > 0 && response.paging.previous) {
                cb.call(self,null,response.data,loadCount++,false);
                $.getJSON(response.paging.previous,loadingPrevFBPostLoop);
            }
            else {
                self.setCachedPosts(loadedPosts);
                cb.call(self,null,response.data,loadCount++,true);
            }
        }
        FB.api("me/posts",{
            limit : 25,
            since : (new Date(latest_post.created_time).getTime()) / 1000
        },loadingPrevFBPostLoop);
    },
    /**
     * @param cb : Function(error,posts,stepCount,isLastPosts)
     */
    loadAllPosts : function(cb){
        var self = this;
        var loadedPosts = [];
        var loadCount = 0;
        var loadingNextFBPostLoop = function(response){
            loadedPosts = _.union(loadedPosts,response.data);
            if(response.error){
                cb.call(self,new Error(response.error));
            }

            if (response.data && response.data.length > 0 && response.paging.next) {
                cb.call(self,null,response.data,loadCount++,false);
                $.getJSON(response.paging.next,loadingNextFBPostLoop);
            }
            else {
                self.setCachedPosts(loadedPosts);
                cb.call(self,null,response.data,loadCount++,true);
            }
        }
        FB.api("me/posts",{ limit:200 },loadingNextFBPostLoop);
    }
};
