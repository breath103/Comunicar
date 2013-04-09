describe("Post",function(){
    var post = null;
    var postDict = {"id":"100002717246207_356212441145994","from":{"name":"Sanghyun  Lee","id":"100002717246207"},"message":"이게 너무 좋다. 맥도날드에서 이걸 판다는 사실 조차 몰랐었는데, 요즘은 이게 너무 먹고싶어서 아침으로 맥모닝이 오면 아주 기분이 좋다 ㅎㅎ. 이걸 먹고있노라면 아침부터 맥주가 땡긴다는게 문제라면 문제","picture":"https://fbcdn-photos-a-a.akamaihd.net/hphotos-ak-ash3/600343_356212207812684_660395540_s.jpg","link":"http://www.youtube.com/watch?v=SnIAxVx7ZUs&ty=15#1252","icon":"https://fbstatic-a.akamaihd.net/rsrc.php/v2/yx/r/og8V99JVf8G.gif","actions":[{"name":"Comment","link":"https://www.facebook.com/100002717246207/posts/356212441145994"},{"name":"Like","link":"https://www.facebook.com/100002717246207/posts/356212441145994"}],"privacy":{"description":"Public","value":"EVERYONE","friends":"","networks":"","allow":"","deny":""},"type":"photo","status_type":"added_photos","object_id":"356212207812684","application":{"name":"Facebook for iPhone","namespace":"fbiphone","id":"6628568379"},"created_time":"2013-03-28T16:23:15+0000","updated_time":"2013-03-28T16:31:23+0000","likes":{"data":[{"name":"현수향","id":"100001208349235"},{"name":"Jae Min Kim","id":"100001607980011"}],"count":2},"comments":{"data":[{"id":"100002717246207_356212441145994_1065385","from":{"name":"Sanghyun  Lee","id":"100002717246207"},"message":"는 아침에 찍은 사진. 지금은 집에서 코딩중이져 ㅎㅎ","created_time":"2013-03-28T16:28:12+0000"},{"id":"100002717246207_356212441145994_1065394","from":{"name":"Sue Lee","id":"100001564628395"},"message":"으?ㅋㅋ 페이크 최고넹 으.. 갑자기 맥모닝 먹고싶다","created_time":"2013-03-28T16:29:35+0000"},{"id":"100002717246207_356212441145994_1065399","from":{"name":"Sanghyun  Lee","id":"100002717246207"},"message":"전혜원 이걸 뭐라고 그러더라.. 해쉬드포테이토인가? 잘모르겠어요 ㅋㅋ","message_tags":[{"id":"1232294196","name":"전혜원","type":"user","offset":0,"length":3}],"created_time":"2013-03-28T16:30:39+0000","likes":1},{"id":"100002717246207_356212441145994_1065402","from":{"name":"전혜원","id":"1232294196"},"message":"접수 ㅋ ^^","created_time":"2013-03-28T16:31:23+0000"}],"count":7}};
    beforeEach(function(){
        post = new Post(postDict);
    });
    describe("initialize", function() {
        it("should initialize with dict",function(){
            expect(post).to.be.a(Post);
            expect(post.id).to.be("100002717246207_356212441145994");
        });
        it("should auth-generate date-key",function(){
            expect(post.dateKey).to.be("2013/03/29");  //yyyy/mm/dd;
        });
    });
    describe("_generateDateKey",function(){
        it("should generate date-key with created_time",function(){
            expect(post._generateDateKey()).to.be("2013/03/29");  //yyyy/mm/dd;
        });
    });
    describe("getYoutubeThumbnail",function(){
        it("should generate youtube video thumbnail image from link",function(){
            expect(post.getYotubueThumbnail()).to.be("http://img.youtube.com/vi/SnIAxVx7ZUs/mqdefault.jpg");
        });
    });
    describe("isContainingString",function(){
        it("should return true if post value is containing string",function(){
            expect(post.isContainingString("맥도날드")).to.be.ok();
        });
        it("should return false if post is not containing string",function(){
            expect(post.isContainingString("sdgasgasgdsfasfsdfdf")).to.not.be.ok();
        });
    });

});


