var results = {};
var requestRet;

function init() {
    keyword = getUrlParameter("search");
    document.getElementById("search_text").value = keyword;
    if (keyword != "") showResults(keyword);
}

function showResults(search) {
	document.getElementById("loading").style.display = "block";
	results = {};
	requestRet = 0;
	var keywords = search.split(" ");
	for (var i=0; i<keywords.length; i++) {
		requestkeyword(i,keywords[i], function(json){
			var table = json.results.bindings;
			for (var j=0; j<table.length; j++) {
				var result = table[j];
				var resource = result.game.value;
				var year = result.date ? result.date.value.substr(0,4) : "";
				var name = result.name.value;
            
				var resname;
				var debuturl = "dbpedia.org/resource/";
				if (resource.includes(debuturl)) {
					resname = resource.substring(resource.lastIndexOf(debuturl) + debuturl.length);
				} else {
					resname = name;
				}
            
				if (resource in results) {
					results[resource].count++;
				}
				else {
					results[resource] = {resource: resource, name: name, year: year, resname: resname, count: 0};
				}
				
				
			}
			requestRet++;
			if(requestRet==keywords.length){
				document.getElementById("loading").style.display = "none";
				var resultsOrdered = [];
				for (var i=0; i<keywords.length; i++) {
					resultsOrdered[i] = [];
				}
				    
				for (key in results) {
					result = results[key];
					resultsOrdered[result.count].push(result);
				}
				    
				for (var i=0; i<keywords.length; i++) {
					resultsOrdered[i].sort(function(a, b){return (a.name).localeCompare(b.name)});
				}
				    
				var total = 0;
				for (var i=keywords.length-1; i>=0; i--) {
					if (i == 0 && total > 0) break;
					for (var j=0; j<resultsOrdered[i].length; j++) {
						game = resultsOrdered[i][j];
						let element = addresult(game.resname, game.name, game.year, "");
						imageWp(game.name, function(url) {
							element.getElementsByTagName("img")[0].src = url;
						});
						total++;
					}
				}
			}
			
		});
	}	
}

function requestkeyword(idx,keyword,callback) {
	// var query = 'select distinct * where {?game a dbo:VideoGame; rdfs:label ?name. OPTIONAL{ ?game dbo:releaseDate ?date. } filter(regex(?name, ".*' + keyword + '.*") && lang(?name)="en")}';
	var query = 'select distinct ?game (sample(?name) as ?name) (max(?date) as ?date) where {?game a dbo:VideoGame; rdfs:label ?name. OPTIONAL{ ?game dbo:releaseDate ?date. } filter(regex(lcase(?name), lcase(".*' + keyword + '.*")) && lang(?name)="en")} group by ?game';
	dbpediaQueryAsync(query, function (json) {callback(json)});
}
