
function init() {
    var resname = getUrlParameter("resource");
    
    showImage(resname);
    
    dbpediaQueryAsync("select * where { <http://dbpedia.org/resource/" + resname + "> ?t ?v }", showInfo);
    
    showLink(resname);
}

function getNameFromResource(resource) {
    return resource.split('/')[4].replace(/_/g, " ");
}
function getNameFromResname(resname) {
    return resname.replace(/_/g, " ");
}

function showImage(resname) {
    imageWp(resname, function(url) {
        document.getElementsByClassName("big")[0].innerHTML = "<img src=\""+url+"\"/>";
    });
}

function showInfo(results) {
    var resname = getUrlParameter("resource");
    var name = getNameFromResname(resname);
    
    var releaseDate;
    var genres = [];
    var publishers = [];
    var computingPlatforms = [];
    var summary;
    var series;
    
    // console.log("resultats :");
    // console.log(results["results"]["bindings"]);
    
    var resultats = results["results"]["bindings"];
    for (var i=0; i<resultats.length; i++) {
        type = resultats[i]["t"].value;
        value = resultats[i]["v"].value;
        
        switch (type) {
            case "http://dbpedia.org/ontology/releaseDate":
                releaseDate = value.substr(0, 4);
                break;
            
            case "http://dbpedia.org/ontology/genre":
                genres.push(getNameFromResource(value));
                break;
            
            case "http://dbpedia.org/ontology/publisher":
                publishers.push(getNameFromResource(value));
                break;
            
            case "http://dbpedia.org/ontology/computingPlatform":
                computingPlatforms.push(getNameFromResource(value));
                break;
            
            case "http://dbpedia.org/ontology/abstract":
                if (resultats[i]["v"]["xml:lang"] === "en") summary = value;
                break;
            
            case "http://dbpedia.org/ontology/series":
                series = value.split('/')[4];
                break;
        }
    }
    
    name = name || "Game";
    releaseDate = releaseDate || "Unknown";
    genre = genres.join(", ") || "Unknown";
    publisher = publishers.join(", ") || "Unknown";
    computingPlatform = computingPlatforms.join(", ") || "Unknown";
    summary = summary || "";
    
    // console.log("infos - name : "+name + ", release : "+releaseDate+" , publisher : "+publisher+" , computingPlatform : "+computingPlatform + ", genre : "+genre+"");
    document.getElementsByClassName("game_info")[0].innerHTML =
        "<h2>" + name + "</h2>" +
        "<h3>Genre: " + genre + "</h3>" +
        "<h3>Publisher: " + publisher + "</h3>" + 
        "<h3>Computing platform: " + computingPlatform + "</h3>" +
        "<h3>Release year: " + releaseDate + "</h3>";
    
    document.getElementById("summary").innerHTML = summary;
    
    if (series) {
        // console.log(series);
        var series = series.toString();
        dbpediaQueryAsync(
            "select * where { ?t dbo:series <http://dbpedia.org/resource/" + series + ">; a dbo:VideoGame. FILTER (?t != <http://dbpedia.org/resource/"+resname+">)} limit 10",
            showRelated
        );
    }
    else if (genres.length > 0)
    {
        var genre = genres[0].replace(/ /g, "_");
        // console.log("genre :" + genres[0]);
        dbpediaQueryAsync(
            "select * where { ?t dbo:genre <http://dbpedia.org/resource/" + genre + ">; a dbo:VideoGame. FILTER (?t != <http://dbpedia.org/resource/"+resname+">)} limit 100",
            showRelated
        );
    }
}

function showLink(resname) {
    $.ajaxPrefilter(function (options) {
        if (options.crossDomain && jQuery.support.cors) {
            var https = (window.location.protocol === 'http:' ? 'http:' : 'https:');
            options.url = https + '//cors-anywhere.herokuapp.com/' + options.url;
        }
    });
    
    var searchName = resname.replace(/_/g, "+");
    var searchURL = "https://www.google.com/search?q=" + searchName + "\"fandom\"";
    
    $.get(
        searchURL,
        function (response) {
            var pos = response.indexOf("<div class=\"r\"><a href");
            response = response.substr(pos).substr(24); // on cherche et recupere l'url
            response = response.substr(0, response.indexOf('"'));
            // console.log("resulat : " + response);
            document.getElementById("linkToFandom").innerHTML= "See more : <a href="+response+">fandom page</a>.";
        }
    );
}

function showRelated(result) {
    // console.log(result);
    var resultats = result["results"]["bindings"];
    
    var names = [];
    for(var i=0; i<resultats.length; i++) {
        // console.log(resultats[i]["t"].value);
        names.push(resultats[i]["t"].value);
    }
    
    names = shuffle(names);
    for (var compt=0; compt<3; compt++) {
        var name = getNameFromResource(names[compt]);
        let ele = addresult(names[compt],name,"","");
        imageWp(name, function(url) {
            ele.getElementsByTagName("img")[0].src = url;
        });
    }
    
    document.getElementById("relatingGame").hidden = false;
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    
    return array;
}
