
function init() {
    var resname = getUrlParameter("resource");
    
    dbpediaQueryAsync("select * where { dbr:" + resname + " ?t ?v }", showInfo);
}

function showInfo(results) {
    var resname = getUrlParameter("resource");
    
    // console.log("resultats :");
    // console.log(results["results"]["bindings"]);
    
    var name = resname.replace(/_/g, " ");
    var releaseDate;
    var genres = [];
    var publishers = [];
    var computingPlatforms = [];
    var summary;
    
    var resultats = results["results"]["bindings"];
    for (var i=0; i<resultats.length; i++) {
        type = resultats[i]["t"].value;
        value = resultats[i]["v"].value;
        
        switch (type) {
            case "http://dbpedia.org/ontology/releaseDate":
                releaseDate = value.substr(0, 4);
                break;
            
            case "http://dbpedia.org/ontology/genre":
                genres.push( value.split('/')[4].replace(/_/g, " ") );
                break;
            
            case "http://dbpedia.org/ontology/publisher":
                publishers.push( value.split('/')[4].replace(/_/g, " ") );
                break;
            
            case "http://dbpedia.org/ontology/computingPlatform":
                computingPlatforms.push( value.split('/')[4].replace(/_/g, " ") );
                break;
            
            case "http://dbpedia.org/ontology/abstract":
                if (resultats[i]["v"]["xml:lang"] === "en") summary = value;
                break;
        }
    }
    
    name = name || "Jeu";
    releaseDate = releaseDate || "Inconnue";
    genre = genres.join(", ") || "Inconnu";
    publisher = publishers.join(", ") || "Inconnu";
    computingPlatform = computingPlatforms.join(", ") || "Inconnue";
    summary = summary || "";
    
    // console.log("infos - name : "+name + ", release : "+releaseDate+" , publisher : "+publisher+" , computingPlatform : "+computingPlatform + ", genre : "+genre+"");
    document.getElementsByClassName("game_info")[0].innerHTML =
        "<h2>" + name + "</h2>" +
        "<h3>Type : " + genre + "</h3>" +
        "<h3>Développeur : " + publisher + "</h3>" + 
        "<h3>Plateforme : " + computingPlatform + "</h3>" +
        "<h3>Année : " + releaseDate + "</h3>";
    
    document.getElementById("summary").innerHTML = summary;
    
    imageWp(resname, function(url) {
        document.getElementsByClassName("big")[0].innerHTML = "<img src=\""+url+"\"/>";
    });
    
    var newLink = "http://gameName.wikia.com/wiki/gameNameWiki";
				newLink = newLink.replace("gameName",name);
				newLink = newLink.replace("gameName",name+"_");

				$("#linkToFandom").attr("href",newLink);
}
