function Post(dict){
    _.extend(this, dict);
    this.dateKey = this._generateDateKey();
}
Post.prototype = {
    _generateDateKey : function(){
        if(this.created_time){
            return moment(this.created_time).local().format("YYYY/MM/DD");
        }
        else
            return "";
    },
    getVideoType : function(){

    },
    getYotubueThumbnail : function(){
        var video_id = url("?v",this.link);
        return "http://img.youtube.com/vi/" + video_id + "/mqdefault.jpg";
    },
    isContainingString : function(query){
        var isContainingString = false;
        var values = _.values(this);
        console.log(values);
        for(var i in values){
            if( String(values[i]).indexOf(query) != -1 )
                return true;
        }
        return false;
    }
};
