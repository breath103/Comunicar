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
	
	this.$prevPage 	  = null;
	this.$currentPage = null;
	this.$nextPage 	  = null;

    this.$currentDatePage = null;

	this.searchFilter = null;
	
    var self = this;

    var searchResultList = $(".search-results-list");

    this.$searchInput.bind("change focus",function(){
        if($(this).val() == "")
			self.setSearchFilter(null);
        else 
			self.setSearchFilter({
				query : $(this).val()
			});
    });
	
	$("body").keyup(function(event) {
		if(event.keyCode == 37){
	    	self.showPrevAvailableDate();
		} else if(event.keyCode == 39) {
			self.showNextAvailableDate();
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
		var endDate   = new Date();
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
				var component = $("<div class='component'></div>");
	            component.css({"height" : (1-v.totalCount/maxCount)*100+"%"});
	            line.append(component);
			
			    _.each(v.types,function(v,type){
					var component = $("<div class='component'></div>");
		            component.css({"height" : v.count/maxCount*100+"%"});
					component.attr("type",type);
		            line.append(component);
				});
			}
			$(".diary-graph .container").append(line);
			dateCount++;
        }
	},
	highlightDateInGraph : function(date){
		$(".diary-graph .container .hightlight").removeClass("hightlight");
		var line = $(".diary-graph .container .line[date='" + date.toKey() + "']");
		line.addClass("hightlight");
		var index = Number(line.attr("graph-index"));
		
		if(line){
			var targetOffset = ( index * line.width()  - $(".diary-graph").width() / 2.0 );
			$(".diary-graph").clearQueue().animate({
				"scrollLeft" : targetOffset >= 0 ? targetOffset : 0
			});
		}
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
	setSearchFilter : function(filter){
		var self = this;
		this.searchFilter = filter;

		$.each($(".date-page"),function(i,page){
			self.applySearchFilterToDatePage($(page));
		});
		
		if(this.searchFilter) {
			var d = new Date();
			_.each( $(".line"), function(line,i){
				line = $(line);
				var dateKey = line.attr("date");
				var datePosts = self.fbContentsManager.getPostsWithDate(dateKey);
			
				var visiblePostCount = 0;
				_.each(datePosts,function(post){
					if(self.checkPostWithSearchFilter(post)){
						visiblePostCount ++;
					}
					else{
					
					} 
				});
				if(visiblePostCount > 0){
					line.animate({opacity:1});
				} else {
					line.animate({opacity:0});
				}
			});
			console.log( (new Date).getTime() - d.getTime());		
		} else {
			$(".line").animate({opacity:1})	;
		}
	},
	getSearchFilter : function(){
		return this.searchFilter;
	},
	applySearchFilterToDatePage : function($page){
		var self = this;
		$.each($page.children(),function(j,post){
			var $post = $(post);
			if(self.checkPostWithSearchFilter($post.attr("post-id"))){
				//$post.css("opacity",1);
				$post.fadeIn();
			} else {
				//$post.css("opacity",0);
				$post.fadeOut();
			}
		});
	},
	checkPostWithSearchFilter : function(post_id){
		var post = null;
		if(_.isString(post_id))
			post = this.fbContentsManager.getPostWithID(post_id);
		else
			post = post_id;
		
		if(this.searchFilter && this.searchFilter.query){
			var q = this.searchFilter.query;
			var checkableProperties = [
				"description",
				"story",
				"message",
				"source",
				"name",
				"caption"
			];
			for(var p in checkableProperties){
				if(post[checkableProperties[p]] && post[checkableProperties[p]].indexOf(q) > -1)
					return true;
			}
			return false;
		} else {
			return true;
		}
	},
	showNextAvailableDate : function(){
		var self = this;
		var validator = function(posts){
			var visiblePostCount = 0;
			_.each(posts,function(post){
				if(self.checkPostWithSearchFilter(post)){
					visiblePostCount ++;
				}
			});
			return visiblePostCount > 0;
		}
		var nextDay = this.fbContentsManager.getFirstAvailableDay(this.getCurrentDate(),+1,validator);
		if(nextDay){
			this.showDay(nextDay);
			return true;
		} else {
			return false;
		}
	},
	showPrevAvailableDate : function(){
		var self = this;
		var validator = function(posts){
			var visiblePostCount = 0;
			_.each(posts,function(post){
				if(self.checkPostWithSearchFilter(post)){
					visiblePostCount ++;
				}
			});
			return visiblePostCount > 0;
		}
		var prevDay = this.fbContentsManager.getFirstAvailableDay(this.getCurrentDate(),-1,validator);
		if(prevDay){
			this.showDay(prevDay);
			return true;
		} else {
			return false;
		}
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
			$page.attr("date-key",dateKey);
            var posts = this.fbContentsManager.getPostsWithDate(date);
            _.each(posts,function(post,i){
                var $post = $(this.postPresenter.presentPost(post));
                $page.prepend($post);
            },this);
            this.datePages[dateKey] = $page;
        }
		this.applySearchFilterToDatePage(this.datePages[dateKey]);
        return this.datePages[dateKey];
    },
	showDay : function(date){
		if(_.isString(date)){
			date = Date.fromKey(date);
		}
		
		var visibleIndexMargin = 2;
		var pageWidth = 55;
        
		var getLeftOffset = function(index){
        	return 50 - pageWidth * 0.5 + index * pageWidth + "%";
        }
		var self = this;
		this.highlightDateInGraph(date);
        var dateKey = date.toKey();

 		if(this.getCurrentDate()) {
			var self = this;
						
			var delta = date.getTime() - this.getCurrentDate().getTime();
 			var deltaSign = delta>0?1:-1;
 			var index = 0;
			
			if(delta > 0){
				$(".date-page[view-index='-1']").stop(true).transit({
					left : getLeftOffset(-2)
				},function(){
					$(this).remove();
				});
			} else {
				$(".date-page[view-index='1']").stop(true).transit({
					left : getLeftOffset(2)
				},function(){
					$(this).remove();
				});
			}
			
			for(var d = new Date(this.getCurrentDate());
				d.toKey() != moment(date).add('d', deltaSign*2).toDate().toKey();
				d.setDate(d.getDate() + deltaSign)) {
 				var page = this.renderDay(d);
 				var leftOffset = getLeftOffset(index * deltaSign);
 				
				if(page.parent().length <= 0)
				{
					//set force if it's just created
 					$(".post-container").append(page);
					page.css({
	 					left:leftOffset
	 				});
				} else {
					page.transit({
	 					left:leftOffset
	 				});
				}
				index++;
			}
			
			var count = index - (visibleIndexMargin/2);
			var index = 0;
			
			for(var d = new Date(this.getCurrentDate());
				d.toKey() != moment(date).add('d', deltaSign*2).toDate().toKey();
				d.setDate(d.getDate() + deltaSign)) {
				(function(index,d){
					var leftOffset = getLeftOffset(index);
	 				var page = self.renderDay(d);
					//이미 기존에 같은 인덱스를 가진 페이지가 있는경우 삭제
					page.attr("view-index",index);

					page.stop(true).transit({
						left : leftOffset 
					},function(){
						$(this).attr("view-index",index);
						if (Math.abs(index) < 2) {
						} else { $(this).remove(); }
					});	
				})((count-index-1) * -deltaSign, d);
				index++;
			}
		} else {
			//initializing
			var prevPage = this.renderDay(moment(date).add('days', -1).toDate());
			var datePage = this.renderDay(date);
			var nextPage = this.renderDay(moment(date).add('days', +1).toDate());
		
			$(".post-container").append(prevPage);
			$(".post-container").append(datePage);
			$(".post-container").append(nextPage);
			
			prevPage.attr("view-index",-1);
			datePage.attr("view-index", 0);
			nextPage.attr("view-index", 1);
		
			prevPage.css({opacity:0,left:getLeftOffset(-1)}).clearQueue().transit({opacity:1});
			datePage.css({opacity:0,left:getLeftOffset(0)}).clearQueue().transit({opacity:1});
			nextPage.css({opacity:0,left:getLeftOffset(+1)}).clearQueue().transit({opacity:1});
		}
		this._setCurrentDate(date);
    },
    showToday : function(){
        this.showDay(new Date());
    }
};
