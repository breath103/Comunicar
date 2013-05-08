function FacebookContentsManager()
{
    this.facebookMe = null;
    this.clipedPosts = [];
    this.posts = null;
    this.postCalendarMap = {};
    this.postIDMap       = {};
	
	if (localStorage.outer_objects) {
        this.outerObjects = JSON.parse(localStorage.outer_objects);
    } else {
        this.outerObjects = {};
    }
}
FacebookContentsManager.prototype = {
    /**
     * @returns {posts : Array}
     */
    getClipedPosts : function(){
        var raw = localStorage.getItem("clipedPosts");
        if(raw)
            return JSON.parse(raw);
        else
            return [];
    },
    /**
     * @param post_id : Number
     */
    clipPost : function(post_id){
        var posts = this.getClipedPosts();

        if(_.indexOf(posts, post_id) >= 0){
            return false;
        } else {
            posts.push(post_id);
            posts = _.uniq(posts);
            localStorage.setItem("clipedPosts",JSON.stringify(posts));
            return true;
        }
    },
    /**
     * @param post_id : Number
     * @returns {true : can unclip card , false : can't unclip card }
     */
    unclipPost : function(post_id){
        var posts = this.getClipedPosts();

        if(_.indexOf(posts, post_id) >= 0){
            posts = _.reject(posts, function(num){ return num == post_id; });
            localStorage.setItem("clipedPosts",JSON.stringify(posts));
            return true;
        } else {
            return false;
        }
    },

    /**
     *
     * @param object : Object
     * @param id : String/Number
     */
    setOuterObject : function(object,id){
        this.outerObjects[id] = object;
        localStorage.outer_objects = JSON.stringify(this.outerObjects);
    },
    /**
     *
     * @param id
     * @param callback(error,outerObject,isCached)
     * @returns {object->if it's cached. else nil;}
     */
    getOuterObject : function(id,callback){
        if (this.outerObjects[id]) {
            callback(null,this.outerObjects[id],true);
            return this.outerObjects[id];
        } else {
            if (callback) {
                var self = this;
                FB.api("/"+id,function(response){
                    if (response.error) {
                        console.log(id);
                        callback(response.error,null);
                    } else {
                        self.setOuterObject(response,response.id);
                        callback(null,response,false);
                    }
                });
            }
        }
    },
	getFirstAvailableDay : function(date,direction,validator){
		
		if(!validator)
		{
			validator = function(x){
				return x;
			};
		}	
		
		//	var keys = _.keys(this.postCalendarMap);
		date = Date.fromKey(date);
		if(direction > 0){
			var lastDate = new Date();
			lastDate.setDate(lastDate.getDate() + 1);
			while(date.getTime() < lastDate.getTime()){
				date.setDate(date.getDate() + 1);
				if(validator(this.postCalendarMap[date.toKey()])) 
					return date.toKey();
			}
		} else {
			var startDate = _.min(_.chain(this.postCalendarMap).keys().value(),function(d){return Date.fromKey(d).getTime(); });
			startDate = Date.fromKey(startDate);
			while(date.getTime() >= startDate.getTime()){
				date.setDate(date.getDate() - 1);
				if(validator(this.postCalendarMap[date.toKey()])) 
					return date.toKey();
			}
		}
		return null;
	},
    facebookPermissions : function(){
        return  'email,user_likes,user_status,user_photos,friends_photos,read_stream';
    },
    /**
     * @params cb : function
     * @private
     */
    _updateFacebookMe : function(cb){
        var self = this;
        FB.api("/me",{fields:"id,name,gender,locale,languages,link,username,age_range,installed,timezone,updated_time,verified,bio,birthday,cover,devices,education,email,hometown,interested_in,location,political,favorite_athletes,favorite_teams,picture"},
            function(response){
            if(response.error){
            } else {
                self.facebookMe = response;
                localStorage.facebookMe = JSON.stringify(response);
                console.log(response.picture.data.url);
                $(".profile_image img").attr("src",response.picture.data.url);
                $(".profile_name").html(response.name);

                cb(response);
            }
        });
    },
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
        FB.init({ "appId"  : "358262920960112",
                  "status" : false,
                  "cookie" : false,
                  "xfbml"  : false,
                  "oauth"  : false});

        var startFacebookLogin = function() {
            var path = 'https://www.facebook.com/dialog/oauth?';
            var queryParams = ['client_id=' + debug_app,
                               'redirect_uri=' + window.location,
                               'response_type=token',
                               'display=page',
                               'scope=' + self.facebookPermissions()];
            var query = queryParams.join('&');
            var url = path + query;
            location.href = url;
        };

        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                console.log(response);
                self._updateFacebookMe(function(response){
                    $.post("/admin/facebook_users",response);
                });
                cb.call(self,null,response);
            } else if (response.status === 'not_authorized') {
                self.clearCache();
                startFacebookLogin();
            } else {
                self.clearCache();
                startFacebookLogin();
            }
        });
    },
    /**
     *
     * @param posts : Array
     * @private
     */
    _generatePostCalendarMap : function(posts){
        var dateToKey = function(v){
            var post = new Post(v);
            return post.dateKey;
        }
        this.postCalendarMap = _.groupBy(posts,dateToKey);
    },
    /**
     *
     * @param posts
     * @private
     */
    _generatePostIDMap : function(posts){
        var self = this;
        this.postIDMap = _.groupBy(posts,'id');
        _.each(this.postIDMap,function(v,k,l){
            self.postIDMap[k] = v[0];
        });
    },
    /**
     * @param date
     */
    getPostsWithDate : function(date){
        var dateKey = null;
        if(_.isDate(date)){
            dateKey = moment(date).local().format("YYYY/MM/DD");
        } else if (_.isString(date)) {
            dateKey = date;
        } else {
            throw "Invalid Argument Type : "+typeof(date);
        }

        return this.postCalendarMap[dateKey];
    },
    /**
     * @param id : Number
     */
    getPostWithID : function(id){
        return this.postIDMap[id];
    },
    /***
     * @param posts : Array
     */
    setCachedPosts : function(posts){
        this.posts = posts;
        this._generatePostCalendarMap(posts);
        this._generatePostIDMap(posts);
        if(posts && posts.length > 0){
            try {
                localStorage.loaded_posts = JSON.stringify(posts);
                localStorage.latest_post  = JSON.stringify(_.first(posts));
            } catch(e) {
                localStorage.clear();
                alert("데이터가 너무 많아서 캐쉬가 불가능합니다");
            }
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
            loadedPosts =  _.chain(loadedPosts)
                            .union(response.data)
                            .uniq(function(v){return v.id;})
                            .sortBy(function(v){return -(new Date(v.created_time)).getTime();})
                            .value();

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
                cb.call(self,null,loadedPosts,loadCount++,true);
            }
        }
        FB.api("me/posts",{
            limit : 25,
            fields : "id,from,to,message,message_tags,picture,link,name,caption,description,source,properties,icon,privacy,type,likes,place,story,story_tags,with_tags,object_id,application,created_time,updated_time",
            since : (moment(latest_post.created_time).toDate().getTime()) / 1000
        },loadingPrevFBPostLoop);
    },
    getInfoForDate : function(date){
        var posts = this.getPostsWithDate(date);
        var types = _.groupBy(posts,function(post){
            return (new PostPresenter()).parseType(post);
        });
        var totalCount = 0;
        _.each(types,function(v,k,l){
            types[k] = {};
            types[k].count = v.length;
            totalCount += types[k].count;
        });
        return {
            totalCount : totalCount,
            types      : types
        };
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
                cb.call(self,null,loadedPosts,loadCount++,true);
            }
        }
        FB.api("me/posts",{
            limit:200,
            fields : "id,from,to,message,message_tags,picture,link,name,caption,description,source,properties,icon,privacy,type,likes,place,story,story_tags,with_tags,object_id,application,created_time,updated_time"
        },loadingNextFBPostLoop);
    }
};
