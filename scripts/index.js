
function init() {
    dbpediaQueryAsync(
        'select distinct ?r ?name ?genre ?dev where { ?r a dbo:VideoGame. ?r dbp:released ?x. filter(regex(?x,"2018")). ?r foaf:name ?name. ?r dbo:genre ?g. ?g rdfs:label ?genre. ?r dbo:developer ?d. ?d rdfs:label ?dev } order by (?x) LIMIT 1',
        lastGamePublishedInfos
    );

    dbpediaQueryAsync(
        'select distinct ?r ?name ?genre ?dev where {?r a dbo:VideoGame. ?r foaf:name ?name. ?r dbo:genre ?g. ?g rdfs:label ?genre. ?r dbo:developer ?d. ?d rdfs:label ?dev } ORDER BY RAND() LIMIT 10000',
        randomGameInfo
    );
}

function lastGamePublishedInfos(data) {
    var result = data.results.bindings[0];
    
    imageWp(result.name.value, function(url) {
        document.getElementById("imageLastGamePublished").src = url;
    });
    
    document.getElementById("titleLastGamePublished").innerText = result.name.value;
    document.getElementById("genreLastGamePublished").innerText = result.genre.value;
    document.getElementById("devLastGamePublished").innerText = result.dev.value;

    resource = getRessourceName(result.r.value,result.name.value);
    document.getElementById("box1").onclick = function(){
        window.location.href = "details.html?resource=" + encodeURIComponent(resource);
    }
}

function randomGameInfo(data){
    var rand = Math.floor(Math.random() * Object.keys(data.results.bindings).length);
    var result = data.results.bindings[rand];

    imageWp(result.name.value, function(url) {
        document.getElementById("imageRandomGame").src = url;
    });
    
    document.getElementById("titleRandomGame").innerText = result.name.value;
    document.getElementById("genreRandomGame").innerText = result.genre.value;
    document.getElementById("devRandomGame").innerText = result.dev.value;

    resource2 = getRessourceName(result.r.value,result.name.value);
    document.getElementById("box2").onclick = function(){
        window.location.href = "details.html?resource=" + encodeURIComponent(resource2);
    }
}

function getRessourceName(resource,name){
    var resname;
				var debuturl = "dbpedia.org/resource/";
				if (resource.includes(debuturl)) {
					resname = resource.substring(resource.lastIndexOf(debuturl) + debuturl.length);
				} else {
					resname = name;
                }
    return resname;
}