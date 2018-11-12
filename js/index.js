
lastGamePublishedInfos();

function lastGamePublishedInfos() {
    dbpediaQuery("select distinct ?name ?genre ?dev where {?r a ?type.?r dbp:released ?x.filter(regex(?type, \".*Game.*\")).filter(regex(?x,\"2018\")).?r foaf:name ?name.?r dbo:genre ?g.?g rdfs:label ?genre.?r dbo:developer ?d.?d rdfs:label ?dev   } order by(?x)LIMIT 1",
    function (data){
        
        //document.getElementById("imageLastGamePublished").innerHTML

        document.getElementById("titleLastGamePublished").innerText = data.results.bindings[0].name.value;
        document.getElementById("genreLastGamePublished").innerText = data.results.bindings[0].genre.value;
        document.getElementById("devLastGamePublished").innerText = data.results.bindings[0].dev.value;

    });

}