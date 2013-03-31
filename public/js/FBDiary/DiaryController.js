function DiaryController(){
    this.fbContentsManager = null;
}
DiaryController.prototype = {
    showDay : function(date){
    },
    movePage : function(pageDelta){
    },
    showPrevPage : function(){
    },
    showNextPage : function(){
    },
    showToday : function(){
        this.showDay(new Date());
    }
};
