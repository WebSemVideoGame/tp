
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
function dbpediaQueryAsync(query, callback) {
    var queryEncoded = encodeURIComponent(query);
    httpGetAsync(
        "https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query="+queryEncoded+"&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+",
        function (data) {callback(JSON.parse(data));}
    );
}

// Execute the query and fire the callback function with the result as a parameter
function dbpediaQuerySync(query) {
    var queryEncoded = encodeURIComponent(query);
    var data = httpGetSync("https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query="+queryEncoded+"&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+");
    return JSON.parse(data);
}


function imageWp(word, callback) {
    $.ajaxPrefilter(function (options) {
        if (options.crossDomain && jQuery.support.cors) {
            var https = (window.location.protocol === 'http:' ? 'http:' : 'https:');
            if ((options.url + '').includes("cors-anywhere")) return;
            options.url = https + '//cors-anywhere.herokuapp.com/' + options.url;
        }
    });
    
    $.get(
        'https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=' + encodeURIComponent(word) + '&callback=?',
        function (response) {
            var debut = "class=\\\"mbox-image\\\"";
            while (response.includes(debut)) {
                response = response.substring(response.indexOf(debut));
                response = response.substring(response.indexOf("src=") + "src=".length);
            }
            
            var url = "";
            try {
                var regexp = /src=\\"(.*?)\\"/mi;
                var m = regexp.exec(response);
                var str = m[1].match(/\/\/(\S*)/)[1];
                var url = "http:" + str;
            } catch {}
            callback(url);
        }
    );
}

function getResourceName(resource, name) {
    var debuturl = "dbpedia.org/resource/";
    if (resource.includes(debuturl)) {
        return resource.substring(resource.lastIndexOf(debuturl) + debuturl.length);
    } else {
        return name;
    }
}
