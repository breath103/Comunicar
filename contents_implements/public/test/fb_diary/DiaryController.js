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
	describe("showDay",function(){
		
	});
	describe("serachFilter",function(){
		var filter = {
			query : "hello"
		};
		it("should set filter",function(){
			controller.setSearchFilter(filter);
			expect(controller.getSearchFilter()).to.be(filter);
		});
		it("should update graph",function(){
			
		});
		it("should update currently visible date-pages",function(){
			
		});
	});
	describe("checkPostWithSearchFilter",function(){
		describe("it should check post with filter",function(){
			xit("should return true if post match to filter",function(){
				
			});
			xit("should return false if post not match to filter",function(){
				
			});
		});
	});
	describe("applySearchFilterToDatePage",function(){
		var $page;
		beforeEach(function(){
			$page = $('<div class="date-page" date-key="2013/04/10" view-index="0">' + 
			 			'<div class="status" post-id="100002717246207_359985687435336"></div>' + 
						'<div class="status" post-id="100002717246207_360148057419099"></div>' +
			            '<div class="status" post-id="100002717246207_554763971211584"></div>' +
				   	  '</div>');
		});
		context("if search filter is not setted",function(){
			beforeEach(function(){
				controller.setSearchFilter(null);
			});
			it("should set all sub posts as a visible",function(){
				$.each($page.children(),function(k,v){
					expect(Number($(v).css("opacity"))).to.be(1);
					expect($(v).css("display")).not.to.be("hidden");
				});
			});
		});
		context("if search filter is setted",function(){
			var filter = {
				query : "hello"
			};
			beforeEach(function(){
				controller.checkPostWithSearchFilter = function(post_id){
					if(post_id == "100002717246207_359985687435336" ||
					   post_id == "100002717246207_554763971211584")
					   return true;
					if(post_id == '100002717246207_360148057419099')
					   return false;
				};	
			});
			it("should hide posts that not mathing search filter",function(){
				controller.setSearchFilter(filter);
				controller.applySearchFilterToDatePage($page);
				var p = null;
				p = $page.children("[post-id='100002717246207_359985687435336']");
				expect( Number($(p).css("opacity")) ).to.be(1);
				p = $page.children("[post-id='100002717246207_360148057419099']");
				expect( Number($(p).css("opacity")) ).not.to.be(1);
				p = $page.children("[post-id='100002717246207_554763971211584']");
				expect( Number($(p).css("opacity")) ).to.be(1);
			});
		});
	});
});