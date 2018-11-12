

// Do an ajax request on theUrl and fire the callback function with the result as a parameter
function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

// Execute the query and fire the callback function with the result as a parameter
function dbpediaQueryAsync(query, callback){
    var queryEncoded = encodeURIComponent(query);
    httpGetAsync("https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query="+queryEncoded+"&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+",
    function (data){callback(JSON.parse(data));});
}




// Do an ajax request on theUrl and return the result
function httpGetSync(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        return xmlHttp.responseText;
    } else {
        return "";
    }
}

// Execute the query and fire the callback function with the result as a parameter
function dbpediaQuerySync(query){
    var queryEncoded = encodeURIComponent(query);
    return httpGetSync("https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query="+queryEncoded+"&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+");
}



// https://davidwalsh.name/query-string-javascript
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};



function showresults(search) {
    var results = {};
    
    var keywords = search.split(" ");
    for (var i=0; i<keywords.length; i++) {
        var json = requestkeyword(keywords[i]);
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
            } else {
                results[resource] = {resource: resource, name: name, year: year, resname: resname, count: 0};
            }
        }
    }
    
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
			console.log(game.resource);
            let element = addresult(game.resname, game.name, game.year, "");
            imageWp(game.name, function(url) {
                element.getElementsByTagName("img")[0].src = url;
            });
            total++;
        }
    }
}

function requestkeyword(keyword) {
    // var query = 'select distinct * where {?game a dbo:VideoGame; rdfs:label ?name. OPTIONAL{ ?game dbo:releaseDate ?date. } filter(regex(?name, ".*' + keyword + '.*") && lang(?name)="en")}';
    var query = 'select distinct ?game (sample(?name) as ?name) (max(?date) as ?date) where {?game a dbo:VideoGame; rdfs:label ?name. OPTIONAL{ ?game dbo:releaseDate ?date. } filter(regex(lcase(?name), lcase(".*' + keyword + '.*")) && lang(?name)="en")} group by ?game';
    var answer = dbpediaQuerySync(query);
    var json = JSON.parse(answer);
    return json;
}



function imageWp(word, callback) {
    $.ajaxPrefilter(function (options) {
        if (options.crossDomain && jQuery.support.cors) {
            var https = (window.location.protocol === 'http:' ? 'http:' : 'https:');
            options.url = https + '//cors-anywhere.herokuapp.com/' + options.url;
        }
    });
    
    $.get(
        'https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=' + encodeURIComponent(word) + '&callback=?',
    
    function (response) {
    try {
		var url;
        var regexp = /src=\\"(.*?)\\"/mi;
        var m = regexp.exec(response);
        var str = m[1].match(/\/\/(\S*)/)[1];
        url = "http:"+str;
        callback(url);
    } catch {}
    });
}

