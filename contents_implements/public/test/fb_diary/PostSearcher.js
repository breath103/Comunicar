describe("PostSearcher", function() {
    var postSearcher = null;
    var contentsManager = null;

    beforeEach(function(){
        contentsManager = new FacebookContentsManager();
        postSearcher = new PostSearcher(contentsManager);
    });
    afterEach(function(){
        contentsManager = null;
        postSearcher    = null;
    });

    describe("initialize", function() {
        it("should be initialized", function() {
            expect(postSearcher).to.be.an(PostSearcher);
        });
    });

    describe("_getSearchLogs",function(){
        xit("should return logs from datas",function(){

        });
    });
    describe("_getSearchLogs",function(){
        xit("should add logs",function(){

        });
    });
    describe("-searchPost",function(){
        context("if there is no result",function(){
            it("should return empty object",function(){
                var result = postSearcher.searchPost({query:"안"});
                expect(_.isEqual(result,{})).to.be.ok();
            });
        });
        context("if there is result",function(){
            beforeEach(function(){
            });
            xit("should return posts",function(){
            });
            xit("should save search logs",function(){
            });
        });
    });
});