describe("FacebookContentsManager", function() {
    var manager = null;
    beforeEach(function(){
        manager = new FacebookContentsManager();
    });

    describe("initialize", function() {
        it("should be initialized", function() {
            expect(manager instanceof FacebookContentsManager).to.be.ok();
        });
    });
    describe("-connectFacebook",function(){
        it("should connect to facebook",function(done){
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
    describe("get/set cached posts",function(){
        var posts = [
            1,2,3,4,5
        ];
        describe("-setCachedPosts",function(){
            beforeEach(function(){
                localStorage.clear();
                manager.setCachedPosts(posts);
            });

            it("should cached posts",function(){
                var cachedPosts = manager.getCachedPosts();
                expect(_.isEqual(posts,cachedPosts)).to.be.ok();
            });
            it("should save latest_post",function(){
                var latestPost = manager.getLatestPost();
                expect(_.isEqual(latestPost, _.first(posts))).to.be.ok();
            });
        });
        describe("-getCachedPosts",function(){
            beforeEach(function(){
                manager.clearCache();
                manager.setCachedPosts(posts);
            });
            it("should cached posts",function(){
                var cachedPosts = manager.getCachedPosts();
                expect(_.isEqual(posts,cachedPosts)).to.be.ok();
                expect(_.isEqual(manager.posts,cachedPosts)).to.be.ok();
            });
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
            console.log(requests);
//            requests[0].respond(200, { "Content-Type": "application/json" }, '[{ "id": 12, "comment": "Hey there" }]');
//            assert.equals(requests.length, 1);
//            assert.match(requests[0].url, "/todo/42/items");
        });
        afterEach(function () {
            xhr.restore();
        });
    });

});