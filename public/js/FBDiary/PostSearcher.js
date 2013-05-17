function PostSearcher(contentsManager){
    this.contentsManager = contentsManager;
    this.searchLogs = this._getSearchLogs();
}
PostSearcher.prototype = {
    _addSearchLogs : function(log){
        this.searchLogs.push(log);
        localStorage.setItem("search_logs",JSON.stringify(this.searchLogs));
    },
    _getSearchLogs : function(){
        var raw = localStorage.getItem("search_logs");
        if(raw) return JSON.parse(raw);
        else return [];
    },
    searchPost : function(params){
        this._addSearchLogs(params);
        if(params.query){
            _gaq.push(['_trackEvent', 'Search', 'with keyword', params.query]);

            var posts =  _.chain(this.contentsManager.posts).filter(function(p){
                var b = false;
                if(p.message) b = b || p.message.indexOf(params.query) >= 0;
                if(p.story)   b = b || p.story.indexOf(params.query) >= 0;
                return b;
            }).value();

            params.result = {
                count : posts.length
            };

            return _.groupBy(posts,function(p){
                return moment(p.created_time).local().format("YYYY/MM/DD");
            });
        }
        return [];
    }
}