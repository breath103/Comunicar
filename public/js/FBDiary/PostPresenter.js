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
    generateTaggedString : function(message,message_tags,tagCovertor){
        _.chain(message_tags).values()
        .flatten()
        .each(function(v){
            message = message.replace(v.name,tagCovertor(v));
        });
        return message;
    },
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
        function valid(x,y){
            return x?x:y;
        }
        var statusTemplate = getTemplate("#status_post");
        post.main_text = this.generateTaggedString(
            valid(post.message,post.story),
            valid(post.message_tags,post.story_tags),
            function(taginfo){
            return "<a href='www.facebook.com/" + taginfo.id + "'>" + taginfo.name + "</a>";
        });
        var $div = $(statusTemplate({post : post}));
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