

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




function imageWp(word) {

    
    $.ajaxPrefilter(function (options) {
        if (options.crossDomain && jQuery.support.cors) {
            var https = (window.location.protocol === 'http:' ? 'http:' : 'https:');
            options.url = https + '//cors-anywhere.herokuapp.com/' + options.url;
            console.log(options.url);
        }
    });

    $.get(
        'https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=' + word + '&callback=?',

    function (response) {
		
        var m;
        var urls = [];
        var regexp = /src=\\"(.*?)\\"/mi;
//see more about .*? : https://stackoverflow.com/questions/3075130/what-is-the-difference-between-and-regular-expressions

        m = regexp.exec(response);
        var str = m[1].match(/\/\/(\S*)/)[1];
        urls.push("http:"+str);
        urls.forEach(function (url) {
            $(".result box").append('<img src="' + url + '">');
        });
    });
}
