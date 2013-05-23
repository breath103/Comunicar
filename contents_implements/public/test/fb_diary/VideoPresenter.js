
describe("VideoPresenter",function(){
    var videoPresenter = null;
    beforeEach(function(){
        videoPresenter = new VideoPresenter();
    });

    describe("generateHQThumbnail",function(){
        xit("should return youtube thumbnail image if it's youtube image",function(){
            expect(videoPresenter.generateHQThumbnail(url))
                .to.be("");
        });
    });
});