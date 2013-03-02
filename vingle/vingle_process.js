var http = require('http');
var fs   = require("fs");
var util = require("util");
var step = require("step");



function RelationManager() {
    this.relations = {
        
    };
    
}
RelationManager.prototype = {
    countRelation : function(p1,p2){
        if(p1 != p2){
            if( ! this.relations[p1]){
                this.relations[p1] = {};    
            }
            if( ! this.relations[p1][p2]){
                this.relations[p1][p2] = 0;
            }
            this.relations[p1][p2]++;	
        }
    },
    countRelationsInArray : function(array,elementToKey){
        var self = this;
        array.forEach(function(e,index){
            for(var i = index;i<array.length;i++){
                self.countRelation(elementToKey(e),elementToKey(array[i]));
                self.countRelation(elementToKey(array[i]),elementToKey(e)); 
            }
        });
    }

};

step(
    function(){
        fs.readFile('./feed.json', this);
    },
    function (err, data) {
        if (err) throw err;
        var cards = JSON.parse(data);
        var relationManager = new RelationManager();
        cards.forEach(function(card,cardIndex) { 
            relationManager.countRelationsInArray(card.parties,function(e){return e.title;});
        });
        console.log(relationManager.relations);
    	
        var data = "var relationData = " + JSON.stringify(relationManager.relations);
    	fs.writeFile("./public/party_relations.json",data,function(error,data){
    		console.log("writeEND : ",error);
    	});
    }
);



