Date.prototype.toKey = function(){
	return moment(this).format("YYYY/MM/DD");
}
Date.fromKey = function(key){
	return moment(key).toDate();
}