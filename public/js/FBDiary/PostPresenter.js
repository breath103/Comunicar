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
    /**
     * generate <a> tagged message
     * @param message : string
     * @param message_tags : array
     * @param tagCovertor : function
     * @returns {*}
     */
    generateTaggedString : function(message,message_tags,tagCovertor){
        _.chain(message_tags).values()
        .flatten()
        .each(function(v){
            message = message.replace(v.name,tagCovertor(v));
        });
        return message;
    },
    /**
     * generate video html
     * @param post
     * @returns {*}
     * @private
     */
    _presentVideo : function(post){
        var videoTemplate = getTemplate("#video_post");
        return videoTemplate({post : post});
    },
    /**
     * generate photo html
     * @param post
     * @returns {*|jQuery|HTMLElement}
     * @private
     */
    _presentPhoto : function(post){
        var self = this;
        var photoTemplate = getTemplate("#photo_post");
//        post.caption = post.caption.split("\n").join("<br/>")

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
    /**
     * generate status html
     * @param post
     * @returns {*|jQuery|HTMLElement}
     * @private
     */
    _presentStatus : function(post){
        function valid(x,y){
            return x?x:y;
        }
        var statusTemplate = getTemplate("#status_post");
        post.main_text = this.generateTaggedString(
            valid(post.message,post.story),
            valid(post.message_tags,post.story_tags),
            function(taginfo){
            return "<a href='https://www.facebook.com/" + taginfo.id + "'>" + taginfo.name + "</a>";
        });
        var $div = $(statusTemplate({post : post}));
        return $div;
    },
    /**
     * generate link html
     * @param post
     * @returns {*}
     * @private
     */
    _presentLink : function(post){
        var linkTemplate = getTemplate("#link_post");
        return linkTemplate({post : post});
    },
    /**
     * generate html with a post data
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
            console.log(post.type);
        }
    },
    _presentClipedPhoto : function(post){
        var self = this;
        var photoTemplate = getTemplate("#cliped_photo_post");
    //    post.caption = post.caption.split("\n").join("<br/>")
        var $photo_post = $(photoTemplate({post : post}));
        this.contentsManager.getOuterObject(post.object_id,function(error,photo,isCached){
            if(error)  console.log(error);
            else $photo_post.find("img").attr("src",photo.source);
        });
        return $photo_post;
    },
    _presentClipedLink : function(post){
        var linkTemplate = getTemplate("#cliped_link_post");
        return linkTemplate({post : post});
    },
    presentClipedPost : function(post){
        if(post.type == "video"){
            return this._presentClipedVideo(post);
        } else if(post.type == "photo") {
            return this._presentClipedPhoto(post);
        } else if(post.type == "status") {
            return this._presentClipedStatus(post);
        } else if(post.type == "link") {
            return this._presentClipedLink(post);
        } else {
            console.log(post.type);
        }
    }
};