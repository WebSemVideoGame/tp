
function init() {
    var keyword = getUrlParameter("search");
    document.getElementById("search_text").value = keyword;
    if (keyword != "") showResults(keyword);
}

var results = {};
var resultsP = {};
function showResults(search) {
    var requestRet = 0;
    var requestPRet = 0;
    
    var keywords = search.split(" ");
    
    document.getElementById("loading_div").style.display = "block";
    
    function requestAdd(json) {
        var table = json.results.bindings;
        for (var j=0; j<table.length; j++) {
            var result = table[j];
            var resource = result.game.value;
            var year = result.date ? result.date.value.substr(0,4) : "";
            var name = result.name.value;
            var resname = getResourceName(resource, name);
            
            if (resource in results) {
                results[resource].count++;
            } else {
                results[resource] = {resource: resource, name: name, resname: resname, year: year, platforms: [], count: 0};
            }
        }
        if(++requestRet == keywords.length) requestsDone();
    }
    
    function requestPAdd(json) {
        var table = json.results.bindings;
        for (var j=0; j<table.length; j++) {
            var result = table[j];
            var resource = result.console.value;
            var name = result.name.value;
            var resname = getResourceName(resource, name);
            var game = result.game.value;
            
            if (game in results) {
                results[game].platforms.push(resname);
                
                if (resource in resultsP) {
                    resultsP[resource].count++;
                } else {
                    resultsP[resource] = {resource: resource, name: name, resname: resname, count: 0};
                }
            }
        }
        if(++requestPRet == keywords.length) requestsPDone();
    }
    
    function requestsDone() {
        var resultsOrdered = [];
        for (var i=0; i<keywords.length; i++) {
            resultsOrdered[i] = [];
        }
        
        for (key in results) {
            var result = results[key];
            resultsOrdered[result.count].push(result);
        }
        
        for (var i=0; i<keywords.length; i++) {
            resultsOrdered[i].sort(function(a, b){return (a.name).localeCompare(b.name)});
        }
        
        document.getElementById("loading_div").style.display = "none";
        
        var total = 0;
        for (var i=keywords.length-1; i>=0; i--) {
            if (i == 0 && total > 0) break;
            for (var j=0; j<resultsOrdered[i].length; j++) {
                var game = resultsOrdered[i][j]; game.count++;
                let element = addresult(game.resource, game.name, game.year, "");
                imageWp(game.name, function(url) {
                    element.getElementsByTagName("img")[0].src = url;
                });
                total++;
            }
        }
        
        for (var i=0; i<keywords.length; i++) {
            requestplatforms(keywords[i], requestPAdd);
        }
    }
    
    function requestsPDone() {
        var resultsOrdered = [];
        for (var key in resultsP) {
            resultsOrdered.push(resultsP[key]);
        }
        
        resultsOrdered.sort(function(a, b){
            return (a.name).localeCompare(b.name);} /* (b.count - a.count) || */
        );
        
        // var resultdivs = document.getElementById("results_div").children;
        
        for (var j=0; j<resultsOrdered.length; j++) {
            var platform = resultsOrdered[j];
            
            var used = false;
            var lookfor = platform.resname;
            for (key in results) {
            // for (var i=1; i<resultdivs.length; i++) {
                var game = results[key];
                // var game = resultdivs[i].dataset.resource;
                // game = results[game];
                if (game.count > 0) {
                    if (game.platforms.includes(lookfor)) {
                        used = true;
                        break;
                    }
                }
            }
            if (used) addresultP(platform.resource, platform.name, platform.resname);
            else delete resultsP[platform.resource];
        }
    }
    
    for (var i=0; i<keywords.length; i++) {
        requestkeyword(keywords[i], requestAdd);
    }
}

function filterresults() {
    var platformsChecked = [];
    
    for (var key in resultsP) {
        var platform = resultsP[key];
        var checkbox = document.getElementById("c_" + platform.resname);
        if (checkbox.checked) platformsChecked.push(platform.resname);
    }
    
    var resultdivs = document.getElementById("results_div").children;
    if (platformsChecked.length == 0) {
        for (var i=1; i<resultdivs.length; i++) {
            var result = resultdivs[i];
            result.style.display = 'block';
        }
    } else {
        for (var i=1; i<resultdivs.length; i++) {
            var result = resultdivs[i];
            var game = result.dataset.resource;
            
            var common = intersect(platformsChecked, results[game].platforms).length;
            result.style.display = (common > 0 ? 'block' : 'none');
        }
    }
}

// https://stackoverflow.com/questions/16227197/compute-intersection-of-two-arrays-in-javascript
function intersect(a,b) {
    return a.filter(function (e) {return b.includes(e);});
}

function addresultP(resource, name, resname) {
    var consoles = document.getElementById("platforms");
    
    var container = document.createElement("div");
    consoles.appendChild(container);
    
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = resname;
    checkbox.id = "c_" + resname;
    checkbox.value = name;
    checkbox.onchange = filterresults;
    container.appendChild(checkbox);
    
    var label = document.createElement("label");
    label.htmlFor = "c_" + resname;
    label.innerText = name;
    container.appendChild(label);
    
    return checkbox;
}

function requestkeyword(keyword,callback) {
    // var query = 'select distinct * where {?game a dbo:VideoGame; rdfs:label ?name. OPTIONAL{ ?game dbo:releaseDate ?date. } filter(regex(?name, ".*' + keyword + '.*") && lang(?name)="en")}';
    var query = 'select distinct ?game (sample(?name) as ?name) (max(?date) as ?date) where {?game a dbo:VideoGame; rdfs:label ?name. OPTIONAL{ ?game dbo:releaseDate ?date. } filter(regex(lcase(?name), lcase(".*' + keyword + '.*")) && lang(?name)="en")} group by ?game';
    dbpediaQueryAsync(query, function (json) {callback(json)});
}

function requestplatforms(keyword,callback) {
    // var query = 'select distinct ?console (sample(?consolename) as ?name) where {?game a dbo:VideoGame; rdfs:label ?name; dbo:computingPlatform ?console. ?console dbo:title ?consolename. filter(lang(?consolename)="en"). filter(regex(lcase(?name), lcase(".*' + keyword + '.*")) && lang(?name)="en")} group by (?console)';
    var query = 'select distinct ?game ?console (?consolename as ?name) where {?game a dbo:VideoGame; rdfs:label ?name; dbo:computingPlatform ?console. ?console dbo:title ?consolename. filter(lang(?consolename)="en"). filter(regex(lcase(?name), lcase(".*' + keyword + '.*")) && lang(?name)="en")}';
    dbpediaQueryAsync(query, function (json) {callback(json)});
}
