function ClipManager(){
    this.posts = [];
}
ClipManager.prototype = {
    getClipedPosts : function(){
        var raw = localStorage.getItem("clipedPosts");
        var posts = JSON.parse(raw);
        return posts;
    },
    addPost : function(post){
        var posts = this.getClipedPosts();
        if(!posts)
            posts = [];
        posts.push(post);
        localStorage.setItem("clipedPosts",JSON.stringify(posts));
    }
};

var clipManager = new ClipManager();