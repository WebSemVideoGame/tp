
function addresult(resname, name, year, picture) {
    results = document.getElementById("results_div");
    result = results.firstElementChild.cloneNode(true);
    
    result.style = "cursor: pointer";
    result.onclick = function() {
        window.location = "details.html?resource=" + encodeURIComponent(resname);
    };
    
    result.getElementsByTagName("h2")[0].innerText = name;
    result.getElementsByTagName("h3")[0].innerText = year;
    result.getElementsByTagName("img")[0].src = picture;
    
    results.appendChild(result);
    return result;
}

