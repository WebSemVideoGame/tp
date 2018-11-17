
function init() {
    dbpediaQueryAsync(
        'select ?r ?name ?genre ?dev where { ?r a dbo:VideoGame. ?r dbp:released ?x. filter(regex(?x,"2018")). ?r foaf:name ?name. ?r dbo:genre ?g. ?g rdfs:label ?genre. ?r dbo:developer ?d. ?d rdfs:label ?dev. filter(lang(?genre) = "en" && lang(?dev) = "en") } order by (?x) LIMIT 1',
        function(data) { showGameInfos("box1", data); }
    );
    
    dbpediaQueryAsync(
        'select ?r ?name ?genre ?dev where {?r a dbo:VideoGame. ?r foaf:name ?name. ?r dbo:genre ?g. ?g rdfs:label ?genre. ?r dbo:developer ?d. ?d rdfs:label ?dev. filter(lang(?genre) = "en" && lang(?dev) = "en") } LIMIT 1000',
        function(data) { showGameInfos("box2", data); }
    );

    var data = dbpediaQuerySync('select distinct ?r  where { ?r dbo:industry ?x. filter(regex(?x, ".*[Vv]ideo.[Gg]ame.*")).  ?r dbo:product ?game. ?game a dbo:VideoGame. ?game foaf:name ?name. filter(lang(?name) = "en")} GROUP BY ?r HAVING (count(?game)>=3)');
    randomDev(data);
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

//Gets the name of a random video game developer in dbpedia and prints it in focus 3
function randomDev(data) {
    var resultats = data.results.bindings;
    var length = Object.keys(resultats).length
    var rand = Math.floor(Math.random() * length);
    var devRessource = resultats[rand].r.value;
    var devLabelData = dbpediaQuerySync('select distinct ?label where {<' + devRessource + '> rdfs:label ?label. filter(lang(?label) = "en" )}');
    document.getElementById("devName").innerText = devLabelData.results.bindings[0].label.value;
    var queryGames = 'select distinct ?r ?name where {<' + devRessource + '> dbo:product ?r. ?r foaf:name ?name. filter(lang(?name) = "en" ) } LIMIT 3 ';
    var dataGames = dbpediaQuerySync(queryGames);
    randomDevGamesInfo(dataGames);
}

//Gets data of 3 games produced by the random video game developer in dbpedia and prints it in focus 3
function randomDevGamesInfo(data) {
    var resultats = data.results.bindings;
    imageWp(resultats[0].name.value, function(url) {
        document.getElementById("imageGame1").src = url;
    });
    document.getElementById("game1").innerText = resultats[0].name.value;

    imageWp(resultats[1].name.value, function(url) {
        document.getElementById("imageGame2").src = url;
    });
    document.getElementById("game2").innerText = resultats[1].name.value;

    imageWp(resultats[2].name.value, function(url) {
        document.getElementById("imageGame3").src = url;
    });
    document.getElementById("game3").innerText = resultats[2].name.value;

}
