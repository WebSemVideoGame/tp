

// Do an ajax request on theUrl and fire the callback function with the result as a parameter
function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
		callback(xmlHttp.responseText);
	}
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

// Execute the query and fire the callback function with the result as a parameter
function dbpediaQuery(query, callback){
		var queryEncoded = encodeURIComponent(query);
		httpGetAsync("https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query="+queryEncoded+"&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+",
		function (data){callback(JSON.parse(data));});
}


// Does not work because of wikipedia.org CORS policy :(
/*function imageUrl(pageName, callback){
	var pageNameEncoded = encodeURIComponent(pageName);
	//"https://en.wikipedia.org/w/api.php?action=query&titles=Dofus&prop=pageimages&format=json&pithumbsize=150"
	httpGetAsync("https://en.wikipedia.org/w/api.php?action=query&titles="+pageNameEncoded+"&prop=pageimages&format=json&pithumbsize=150",
	function (data){
			var obj = JSON.parse(data);
			obj.query.
			
			Object.keys(obj.query).forEach(function(key) {
				callback(obj.query[key].thumbnail.source);
			});
	}
	);
}*/
