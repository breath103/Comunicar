function getTemplate(template_selector){
    _.templateSettings = {
        interpolate : /\{\{(.+?)\}\}/g
    };
    var rawTemplateHtml = _.unescape($("#templates").find(template_selector).html());
    return _.template(rawTemplateHtml);
}
function PostPresenter(contentsManager){
    this.contentsManager = contentsManager;
}
PostPresenter.prototype = {
    _presentVideo : function(post){
        var videoTemplate = getTemplate("#video_post");
        return videoTemplate({post : post});
    },
    _presentPhoto : function(post){
        var self = this;
        var photoTemplate = getTemplate("#photo_post");
        var $photo_post = $(photoTemplate({post : post}));
        this.contentsManager.getOuterObject(post.object_id,function(error,photo,isCached){
            if(error) {
                console.log(error);
            }
            else {
                $photo_post.find("img").attr("src",photo.source);
            }
        });
        return $photo_post;
    },
    _presentStatus : function(post){
        var statusTemplate = getTemplate("#status_post");
        var $div = $(statusTemplate({post : post}));
        $div.click(function(){
            console.log(post);
        });
        return $div;
    },
    _presentLink : function(post){
        var linkTemplate = getTemplate("#link_post");
        return linkTemplate({post : post});
    },
    /**
     * @param post
     */
    presentPost : function(post){
        if(post.type == "video"){
            return this._presentVideo(post);
        } else if(post.type == "photo") {
            return this._presentPhoto(post);
        } else if(post.type == "status") {
            return this._presentStatus(post);
        } else if(post.type == "link") {
            return this._presentLink(post);
        } else {
            //   console.log(post.type);
        }
    }
};