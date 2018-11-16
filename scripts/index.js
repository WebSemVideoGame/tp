
function init() {
    dbpediaQueryAsync(
        'select ?r ?name ?genre ?dev where { ?r a dbo:VideoGame. ?r dbp:released ?x. filter(regex(?x,"2018")). ?r foaf:name ?name. ?r dbo:genre ?g. ?g rdfs:label ?genre. ?r dbo:developer ?d. ?d rdfs:label ?dev. filter(lang(?genre) = "en" && lang(?dev) = "en") } order by (?x) LIMIT 1',
        function(data) { showGameInfos("box1", data); }
    );
    
    dbpediaQueryAsync(
        'select ?r ?name ?genre ?dev where {?r a dbo:VideoGame. ?r foaf:name ?name. ?r dbo:genre ?g. ?g rdfs:label ?genre. ?r dbo:developer ?d. ?d rdfs:label ?dev. filter(lang(?genre) = "en" && lang(?dev) = "en") } LIMIT 1000',
        function(data) { showGameInfos("box2", data); }
    );
}

function showGameInfos(id, data) {
    var box = document.getElementById(id);
    
    var index = Math.floor(Math.random() * data.results.bindings.length);
    var result = data.results.bindings[index];
    
    imageWp(result.name.value, function(url) {
        box.getElementsByTagName("img")[0].src = url;
    });
    
    box.getElementsByTagName("h3")[0].innerText = result.name.value;
    box.getElementsByTagName("h5")[0].innerText = result.genre.value;
    box.getElementsByTagName("h5")[1].innerText = result.dev.value;
    
    var resource = getResourceName(result.r.value,result.name.value);
    box.onclick = function() {
        window.location.href = "details.html?resource=" + encodeURIComponent(resource);
    }
}
