/*
function createPostDiv(v){
    $(".site-container").append( generatePostDivHTML(v) ).children().last().click(function(){
        $(".left-pad").html(JSON.stringify(v));
    });
}
function createPostDivAndPrepend(v){
    $(".site-container").prepend(generatePostDivHTML(v))
        .children()
        .last()
        .click(function(){
            $(".left-pad").html(JSON.stringify(v));
        });
}


if (localStorage.latest_post) { //if is there a cached response already exist.
    var loadedPosts = [];

    if(localStorage.loaded_posts)
        loadedPosts = JSON.parse(localStorage.loaded_posts);
    else{
        loadedPosts = [];
    }

    var latest_post = JSON.parse(localStorage.latest_post);

    _.each(loadedPosts, createPostDiv);

    console.log(latest_post);

    $(".Loading").css({"display":"none"});
    var loadingPrevFBPostLoop = function(response){
        loadedPosts =
            _.chain(loadedPosts)
                .union(response.data)
                .uniq(function(v){return v.id;})
                .sortBy(function(v){return -(new Date(v.created_time)).getTime();})
                .value();

        _(response.data.reverse()).each(createPostDivAndPrepend);

        if(response.data.length > 0 && response.paging.previous){
            console.log(response);
            $.getJSON(response.paging.previous,loadingPrevFBPostLoop);
        }
        else {
            console.log(loadedPosts);
            localStorage.loaded_posts = JSON.stringify(loadedPosts);
            localStorage.latest_post  = JSON.stringify(_.first(loadedPosts));
            $(".Loading").fadeOut();
        }
    }
    FB.api("me/posts",{
        limit:25,
        since: (new Date(latest_post.created_time).getTime())/1000
    },loadingPrevFBPostLoop);

} else {
    var loadedPosts = [];

    $(".Loading").html("페이스북 정보를 로딩중입니다. 이 로딩은 초기 한번만 실행됩니다");
    var loadingNextFBPostLoop = function(response){
        loadedPosts = _.union(loadedPosts,response.data);
        _.each(response.data, createPostDiv);
        if(response.data.length > 0 && response.paging.next){
            $.getJSON(response.paging.next,loadingNextFBPostLoop);
            $(".Loading").append("<p>" + response.data.length + "</p>");
        }
        else {
            console.log("loading finished");
            alert("글 로딩이 끝났습니다");
            localStorage.loaded_posts = JSON.stringify(loadedPosts);
            localStorage.latest_post  = JSON.stringify(_.first(loadedPosts));
            $(".Loading").fadeOut();
        }
    }
    FB.api("me/posts",{limit:200},loadingNextFBPostLoop);
}


function FacebookContentsManager()
{
    this.posts = [];
}
FacebookContentsManager.prototype = {

};


*/