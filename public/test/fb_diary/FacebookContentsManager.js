describe("FacebookContentsManager", function() {
    var manager = null;
    var posts = [
        {id:15125   , created_time: "2012-07-29T14:12:28+0000" , message : "ㅁㄴㅎㅁㄴㅇㄹㅁㄴㅇㄹ"},
        {id:23512   , created_time: "2012-08-21T14:12:28+0000"},
        {id:34625   , created_time: "2012-08-21T14:12:28+0000"},
        {id:1513512 , created_time: "2012-10-03T14:12:28+0000"},
        {id:1251243 , created_time: "2012-12-29T14:12:28+0000"}
    ];

    beforeEach(function(){
        manager = new FacebookContentsManager();
    });
    afterEach(function(){
        manager.clearCache();
    });

    describe("initialize", function() {
        it("should be initialized", function() {
            expect(manager instanceof FacebookContentsManager).to.be.ok();
        });
    });
    describe("-connectFacebook",function(){
        xit("should connect to facebook",function(done){
            manager.connectFacebook(function(error,response){
           	 	expect(this).to.be(manager);
                done();
            });
        });
    });
    describe("clearCache",function(){
        it("should clear localStorage",function(){
            var mock = sinon.mock(localStorage);
            mock.expects("clear").once();

            manager.clearCache();

            mock.verify();
        });
    });

    describe("getPostsWithDate",function(){
        beforeEach(function(){
            localStorage.clear();
            manager.setCachedPosts(posts);
        });
        it("should throw error for wrong value",function(){
            expect(function(){
                manager.getPostsWithDate(23523523);
            }).to.throwException(function(e){
                expect(e).to.be("Invalid Argument Type : number");
            });
        });
        context("with a String key",function(){
            it("should return posts array for date",function(){
                var a = manager.getPostsWithDate("2012/08/21");
                expect(a.length).to.be(2);
                expect(a[0]).to.be(posts[1]);
                expect(a[1]).to.be(posts[2]);
            });
        });
        context("with a Date key",function(){
            it("should return posts array for date",function(){
                var a = manager.getPostsWithDate(new Date("2012-08-21T14:12:28+0000"));
                expect(a.length).to.be(2);
                expect(a[0]).to.be(posts[1]);
                expect(a[1]).to.be(posts[2]);
            });
        });
    });

    describe("get/set cached posts",function(){
        beforeEach(function(){
            localStorage.clear();
            manager.setCachedPosts(posts);
        });
        afterEach(function(){
            manager.clearCache();
        });
        describe("-setCachedPosts",function(){
            it("should cached posts",function(){
                var cachedPosts = manager.getCachedPosts();
                expect(_.isEqual(posts,cachedPosts)).to.be.ok();
            });
            it("should save latest_post",function(){
                var latestPost = manager.getLatestPost();
                expect(_.isEqual(latestPost, _.first(posts))).to.be.ok();
            });
            it("should generate postCalendarMap",function(){
                var a = manager.getPostsWithDate("2012/08/21");
                expect(a.length).to.be(2);
                expect(a[0]).to.be(posts[1]);
                expect(a[1]).to.be(posts[2]);

                expect(_.isEqual(manager.getPostsWithDate("2012/07/29"),[ posts[0] ])).to.be.ok();
            });
        });
        describe("-getCachedPosts",function(){
            it("should cached posts",function(){
                var cachedPosts = manager.getCachedPosts();
                expect(_.isEqual(posts,cachedPosts)).to.be.ok();
                expect(_.isEqual(manager.posts,cachedPosts)).to.be.ok();
            });
        });
    });

    describe("clipPost",function(){
        it("should return false and do nothing if post is already cliped",function(){
            var post = posts[0];
            expect(manager.clipPost(post.id)).to.be.ok();
            expect(manager.clipPost(post.id)).to.not.be.ok();
        });
        it("should return true and clipd post if not cliped yet",function(){
            var post = posts[0];
            expect(manager.clipPost(post.id)).to.be.ok();
            expect(_.last(manager.getClipedPosts())).to.be(post.id);
        });
    });
    describe("unclipPost",function(){
        beforeEach(function(){
            localStorage.clear();
        });
        it("should return true and unclip post if it's already cliped.",function(){
            var post = posts[0];

        });
        xit("should return true and clipd post if not cliped yet",function(){
            var post = posts[0];
            expect(manager.clipPost(post.id)).to.be.ok();
            expect(_.last(manager.getClipedPosts())).to.be(post.id);
        });
    });
    describe("getClipedPosts",function(){
        xit("should return array of cliped posts",function(){

        });
    });
	describe("getFirstAvailableDay",function(){
		beforeEach(function(){
            manager.setCachedPosts([
		        {id:23512   , created_time: "2012-08-21T14:12:28+0000"},
		        {id:1513512 , created_time: "2012-10-03T14:12:28+0000"},
		        {id:15125   , created_time: "2012-07-29T14:12:28+0000" , message : "ㅁㄴㅎㅁㄴㅇㄹㅁㄴㅇㄹ"},
				{id:1251243 , created_time: "2012-12-29T14:12:28+0000"},
		        {id:34625   , created_time: "2012-08-21T14:12:28+0000"},
	    	]);
		});
		it("should work with a Date object to",function(){
			var date = new Date();
			date.setYear(2012);
			date.setMonth(8);
			date.setDate(20);
			expect(manager.getFirstAvailableDay(date,+1)).to.be("2012/10/03"); 
		});
		context("direction is right",function(){
			it("should return first availabe day(which has contents) after passed day",function(){
				expect(manager.getFirstAvailableDay("2012/08/21",+1)).to.be("2012/10/03"); 
				expect(manager.getFirstAvailableDay("2012/10/02",+1)).to.be("2012/10/03");
				expect(manager.getFirstAvailableDay("2012/10/03",+1)).to.be("2012/12/29"); 
				expect(manager.getFirstAvailableDay("2012/10/04",+1)).to.be("2012/12/29"); 
			});
			it("should return null after passed day if there's no available day after passed day",function(){
				expect(manager.getFirstAvailableDay("2012/12/29",+1)).to.be(null);
				expect(manager.getFirstAvailableDay("2012/12/30",+1)).to.be(null);
			});	
		});
		context("direction is left",function(){
			it("should return first availabe day(which has contents) before passed day",function(){
				expect(manager.getFirstAvailableDay("2012/08/21",-1)).to.be("2012/07/29"); 
				expect(manager.getFirstAvailableDay("2012/10/02",-1)).to.be("2012/08/21");
				expect(manager.getFirstAvailableDay("2012/10/03",-1)).to.be("2012/08/21"); 
				expect(manager.getFirstAvailableDay("2012/10/04",-1)).to.be("2012/10/03"); 
				expect(manager.getFirstAvailableDay("2012/07/30",-1)).to.be("2012/07/29");
			});
			it("should return null after passed day if there's no available day before passed day",function(){
				expect(manager.getFirstAvailableDay("2012/07/29",-1)).to.be(null);
				expect(manager.getFirstAvailableDay("2012/07/28",-1)).to.be(null);
			});	
		});
	});
	
    describe("getInfoForDate",function(){
        beforeEach(function(){
            localStorage.clear();
            manager.setCachedPosts([
                {type:"video"  , created_time: "2012-07-29T14:12:28+0000"},
                {type:"video"  , created_time: "2012-07-29T14:12:28+0000"},
                {type:"video"  , created_time: "2012-07-29T14:12:28+0000"},
                {type:"photo"  , created_time: "2012-07-29T14:12:28+0000"},
                {type:"photo"  , created_time: "2012-07-29T14:12:28+0000"},
                {type:"link"   , created_time: "2012-07-29T14:12:28+0000"},
                {type:"link"   , created_time: "2012-07-29T14:12:28+0000"},
                {type:"link"   , created_time: "2012-07-29T14:12:28+0000"},
                {type:"status" , created_time: "2012-07-29T14:12:28+0000"},
                {type:"status" , created_time: "2012-07-29T14:12:28+0000"},
                {type:"status" , created_time: "2012-07-29T14:12:28+0000"},
                {type:"status" , created_time: "2012-07-29T14:12:28+0000"}
            ]);
        });
        it("should return information about specific date",function(){
            var info = manager.getInfoForDate("2012/07/29");
            expect(info.types.video.count).to.be(3);
            expect(info.types.photo.count).to.be(2);
            expect(info.types.link.count).to.be(3);
            expect(info.types.status.count).to.be(4);
            expect(info.totalCount).to.be(12);
        });
        afterEach(function(){
            localStorage.clear();
        });
    });



    describe("-loadAllPosts",function(){
        var xhr      = null;
        var requests = [];

        beforeEach(function () {
            xhr = sinon.useFakeXMLHttpRequest();
            requests = [];
            xhr.onCreate = function (req) { requests.push(req); };
        });
        xit("load all Posts", function () {
            var callback = sinon.spy();
            manager.loadAllPosts({
                onPostsLoaded    : callback ,
                onPostsAllLoaded : callback ,
                onFailure        : callback
            });
//            requests[0].respond(200, { "Content-Type": "application/json" }, '[{ "id": 12, "comment": "Hey there" }]');
//            assert.equals(requests.length, 1);
//            assert.match(requests[0].url, "/todo/42/items");
        });
        afterEach(function () {
            xhr.restore();
        });
    });
});