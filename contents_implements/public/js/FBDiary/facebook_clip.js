function ClipManager(){
    this.posts = [];
}
ClipManager.prototype = {
    getClipedPosts : function(){
        var raw = localStorage.getItem("clipedPosts");
        if(raw)
            return JSON.parse(raw);
        else
            return [];
    },
    clipPost : function(post_id){
        var posts = this.getClipedPosts();
        if(!posts)
            posts = [];
        posts.push(post_id);
        localStorage.setItem("clipedPosts",JSON.stringify(posts));
    }
};
var clipManager = new ClipManager();