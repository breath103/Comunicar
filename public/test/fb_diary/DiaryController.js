describe("DiaryController",function(){
	var controller = null;
	
	beforeEach(function(){
		var contentsManager = new FacebookContentsManager();
		controller = new DiaryController(contentsManager);
	});
	describe("initializing",function(){
		it("should be initialized",function(){
			expect(controller).to.be.a(DiaryController);
		});
		it("should have contentsManager",function(){
			expect(controller.fbContentsManager).to.be.a(FacebookContentsManager);
		});
	});
	describe("serachFilter",function(){
		var filter = {
			
		};
		it("should set filter",function(){
			var filter = {
				query : "search value"
			};
			controller.setSearchFilter(filter);
			expect(controller.getSearchFilter()).to.be(filter);
		});
		it("should update graph",function(){
			
		});
		it("should update currently visible date-pages",function(){
			
		});
	});
});