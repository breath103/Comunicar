describe("PostPresenter",function(){
    var postPresenter = null;
    var contentsManager = new FacebookContentsManager();
    var post = {"id":"100002717246207_359985687435336",
                "from":{
                    "name":"Sanghyun  Lee",
                    "id":"100002717246207"
                },"to":{
                    "data":[
                        {"name":"Sue Lee","id":"100001564628395"},
                        {"name":"Na Yeon Lee","id":"100001033134560"}
                    ]
                },"message":"dgsad 이수영 ㅇㄴㅎㅁㄴㅇㅎ Na Yeon Lee",
                "message_tags":{
                    "6":[{"id":"100001564628395","name":"이수영","type":"user","offset":6,"length":3}],
                    "18":[{"id":"100001033134560","name":"Na Yeon Lee","type":"user","offset":18,"length":11}]},
                "privacy":{"description":"Only Me","value":"SELF","friends":"","networks":"","allow":"","deny":""},
                "type":"status",
                "created_time":"2013-04-09T15:38:40+0000",
                "updated_time":"2013-04-09T15:38:40+0000"};


    beforeEach(function(){
        postPresenter = new PostPresenter(contentsManager);
    });

    describe("generateTaggedString",function(){
        it("it should generate tagged string with post",function(){
            var taggedString =
                postPresenter.generateTaggedString(post.message,post.message_tags,function(taginfo){
                    return "<a href='https://www.facebook.com/" + taginfo.id + "'>" + taginfo.name + "</a>";
                });

            expect(taggedString).to.be("dgsad <a href='https://www.facebook.com/100001564628395'>이수영</a>" +
                                        " ㅇㄴㅎㅁㄴㅇㅎ <a href='https://www.facebook.com/100001033134560'>Na Yeon Lee</a>");
        });
    });
    describe("getStatusPostType",function(){
        context("if is there any message",function(){
            it("should return 'likes' if it's type is likes",function(){
                expect(postPresenter.getStatusPostType({
                    type  : "status",
                    message : "wggsgwdgdsg"
                })).to.be("status");
            });
        });
        context("if is there any story",function(){
            it("should return 'likes' if it's type is likes",function(){
                expect(postPresenter.getStatusPostType({
                    type  : "status",
                    story : "me likes him"
                })).to.be("likes");
            });
            it("should return 'comment' if it's type is comment",function(){
                expect(postPresenter.getStatusPostType({
                    type  : "status",
                    story : "mesdga on him"
                })).to.be("comment");
            });
        });
    });
});


