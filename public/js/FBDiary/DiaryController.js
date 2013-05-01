
"use strict"
function DiaryController(contentsManager){
    this.fbContentsManager = contentsManager;
    this.postPresenter = new PostPresenter(this.fbContentsManager);
    this.postSearcher  = new PostSearcher(this.fbContentsManager);
    this.timelineController = new TimelineController();
    this.currentDate = null;

    this.query = null;
    this.searchResult = {};
    this.$searchInput = $("#search-input");
    this.datePages = {};

    this.$currentDatePage = null;
    var self = this;

    var searchResultList = $(".search-results-list");

    this.$searchInput.bind("change focus",function(){
        if($(this).val() == "") {
            searchResultList.clearQueue().transit({"left":"-100%"});
        }
        else {
            searchResultList.clearQueue().transit({"left":"0%"});
            self.showSearchResultMap($(this).val(),
                                     self.postSearcher.searchPost({query : $(this).val()}));
        }
    });
    $("#search-button").click(function(){
        if(self.$searchInput.val() == "") {
            searchResultList.clearQueue().transit({"left":"-100%"});
        }
        else {
            searchResultList.clearQueue().transit({"left":"0%"});
            self.showSearchResultMap(self.$searchInput.val(),
                                     self.postSearcher.searchPost({query : self.$searchInput.val()}));
        }
    });
}

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

DiaryController.prototype = {
    /**
     * Generate graph from posts info
     */
    generateGraph : function(){
        var self = this;
	    var calendarMap = this.fbContentsManager.postCalendarMap;
        var calendarInfoMap = {};
		
        _.each(calendarMap,function(v,k){
            calendarInfoMap[k] = self.fbContentsManager.getInfoForDate(k);
        });
		
		var maxCount  = _.max(calendarInfoMap, function(info){return info.totalCount;}).totalCount;
		var startDate = Date.fromKey( _.last( _.keys(calendarInfoMap)) );
		var endDate   = new Date();//Date.fromKey( _.first(_.keys(calendarInfoMap)) );
		
		var dateCount = 0;
		for(var d = startDate ; d.getTime() < endDate.getTime() ; d.setDate(d.getDate()+1))
		{
			var k = d.toKey();
			var v = calendarInfoMap[k];
			
			var line = $("<div class='line'></div>");
			line.click(function(){
				self.showDay(Date.fromKey( $(this).attr("date") ));
			});
			line.attr("date",k);
			line.attr("graph-index",dateCount);
			if(v){
				_.each(v.types,function(v,k){
					var component = $("<div class='component'></div>");
		            component.css({"height" : v.count/maxCount*100+"%"});
					component.css({"background-color":get_random_color()});
		            line.append(component);
				});
			}
			$(".diary-graph .container").append(line);
		
			dateCount++;
        }
	},
	highlightDate : function(date){
		$(".diary-graph .container .hightlight").removeClass("hightlight");
		var line = $(".diary-graph .container .line[date='" + date.toKey() + "']");
		line.addClass("hightlight");
		var index = Number(line.attr("graph-index"));
		
		$(".diary-graph").animate({
			"scrollLeft" : ( index * 10 - $(".diary-graph").width() / 2.0  )
		});
	},
    showSearchResultMap : function(query,searchResult){
        var self = this;
        $(".search-results-list").find(".date").remove();
        $(".search-results-list").find(".year").remove();
        var prevYear = 0;

        _.each(searchResult,function(v,k){
            var keyDate = Date.fromKey(k);
            if(prevYear != keyDate.year()){
                $(".search-results-list").append('<h4 class="year" >'+keyDate.year()+'</h4>');
                prevYear = keyDate.year();
            }
            var $div = $('<div class="date"><h5 style="padding: 0;margin: 0;display :inline;"></h5><span style="float:right;margin-right:15%" class="badge badge-info"></span></div>');
            $div.children(".badge").html(v.length);
            $div.children("h5").html(keyDate.format("M월 D일"));
            $(".search-results-list").append($div);
            $div.click(function(){
                self.showDay(Date.fromKey(k));
            });
        });
    },
    presentClipedPosts : function(){
        var self = this;
        _.each(self.fbContentsManager.getClipedPosts(),function(post_id,index){
            var post  = self.fbContentsManager.getPostWithID(post_id);
            self.onClipPost(post);
        });
    },
    /**
     * event handler for clip post
     * @param post
     */
    onClipPost : function(post){
        var self = this;

        var $post = $(this.postPresenter.presentClipedPost(post));

        $post.click(function(){
            self.fbContentsManager.unclipPost(post.id);
            $(this).remove();
        });

        $(".clip-container").prepend($post);
    },
    _setCurrentDate : function(date){
        this.currentDate = date;
        $(".date_indicator").html(date.toKey());
    },
    getCurrentDate : function(){
        return this.currentDate;
    },
    moveDate : function(dateDelta){
        var currentDate = new Date(this.getCurrentDate());
        currentDate.setDate(currentDate.getDate()+dateDelta);
        this.showDay(currentDate);
    },
    renderDay : function(date){
        var dateKey = date.toKey();
        if(!this.datePages[dateKey]){
            var $page = $("<div class='date-page'></div>");
            var posts = this.fbContentsManager.getPostsWithDate(date);
            _.each(posts,function(post,i){
                var $post = $(this.postPresenter.presentPost(post));
                $page.prepend($post);
            },this);
            this.datePages[dateKey] = $page;
        }
        return this.datePages[dateKey];
    },

    showDay : function(date){
        var self = this;

		this.highlightDate(date);
        var dateKey = date.toKey();

        var delta = 0;
        var deltaSign = delta>0?1:-1;

        if(this.getCurrentDate())
            delta = date.getTime() - this.getCurrentDate().getTime();

        this._setCurrentDate(date);

        //var prevPage = this.renderDay(moment(date).add('days',-1).toDate());
        var datePage = this.renderDay(date);
        //var nextPage = this.renderDay(moment(date).add('days',1).toDate());

        if(this.$currentDatePage) {
            this.$currentDatePage.transit({
               opacity : 0
            },function(){
                $(this).remove();
            });
        }
		

        $(".post-container").append(datePage);
        datePage.css({
            opacity : 0
        }).transit({
            opacity : 1
        });
        this.$currentDatePage = datePage;

    },
    showToday : function(){
        this.showDay(new Date());
    }
};
