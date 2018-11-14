


function init() {
    
    var resname = getUrlParameter("resource");
    var nameSearch = resname.replace(/_/g, "+");
    var fandomLink = "https://www.google.com/search?q="+nameSearch+"fandom";
    dbpediaQueryAsync("select * where { <http://dbpedia.org/resource/" + resname + "> ?t ?v }", showInfo);
    $.ajaxPrefilter(function (options) {
        if (options.crossDomain && jQuery.support.cors) {
            var https = (window.location.protocol === 'http:' ? 'http:' : 'https:');
            options.url = https + '//cors-anywhere.herokuapp.com/' + options.url;
        }
    });
    
    $.get(
        fandomLink,
        function (response) {
		
		var pos = response.indexOf("<div class=\"r\"><a href");
		response  = response.substr(pos, response.length);
		response = response.substr(24, response.length); // on cherche et recupere l'url
		response = response.split('"')[0]; 
		console.log("resulat : "+response);
		document.getElementById("linkToFandom").innerHTML= "See more : <a href="+response+" >Fandom page </a>";
	})
}

function shuffle(array) { //source  : https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
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
    var series;
    
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

 	case "http://dbpedia.org/ontology/series":
				series=value.split('/')[4];
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
        "<h3>Genre : " + genre + "</h3>" +
        "<h3>Publisher : " + publisher + "</h3>" + 
        "<h3>Computing Platform: " + computingPlatform + "</h3>" +
        "<h3>Release Year : " + releaseDate + "</h3>";
    
    document.getElementById("summary").innerHTML = summary;
    
    imageWp(resname, function(url) {
        document.getElementsByClassName("big")[0].innerHTML = "<img src=\""+url+"\"/>";
    });
    
    var newLink = "http://gameName.wikia.com/wiki/gameNameWiki";
				newLink = newLink.replace("gameName",name);
				newLink = newLink.replace("gameName",name+"_");

				$("#linkToFandom").attr("href",newLink);

	if(series){
		 var x = document.getElementById("relatingGame");
			console.log(series);
			series = series.toString();
			x.hidden = false;
			var names = [];
			dbpediaQueryAsync("select * where {  ?t dbo:series <http://dbpedia.org/resource/" + series + ">  FILTER (?t != <http://dbpedia.org/resource/"+resname+">)} limit 10 ", function(result){
				console.log(result);
				var resultats = result["results"]["bindings"];
	
				for(var i = 0; i<resultats.length;i++){
					//console.log(resultats[i]["t"].value);
					names.push(resultats[i]["t"].value.split('/')[4].replace(/_/g, " "));	
					
					}
					names = shuffle(names);
				let compt = 0;
				for (compt; compt<3; compt++)
				{
				//names.forEach(function(element){
					let ele = addresult(names[compt].replace(/ /g, "_"),names[compt],"","");
					imageWp(names[compt], function(url) {
						
						ele.getElementsByTagName("img")[0].src = url;
					});
				
					
				
				//});
				}

			});
	}
}
