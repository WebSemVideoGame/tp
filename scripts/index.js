
function init() {
    dbpediaQueryAsync(
        'select distinct ?name ?genre ?dev where { ?r a dbo:VideoGame. ?r dbp:released ?x. filter(regex(?x,"2018")). ?r foaf:name ?name. ?r dbo:genre ?g. ?g rdfs:label ?genre. ?r dbo:developer ?d. ?d rdfs:label ?dev } order by (?x) LIMIT 1',
        lastGamePublishedInfos
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
}
