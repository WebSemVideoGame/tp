
function addresult(resource, name, year, picture) {
    var results = document.getElementById("results_div");
    var result = results.firstElementChild.cloneNode(true);
    
    var resname = getResourceName(resource, name);
    
    result.getElementsByTagName("a")[0].href = "details.html?resource=" + encodeURIComponent(resname);
    
    result.getElementsByTagName("h2")[0].innerText = name;
    result.getElementsByTagName("h3")[0].innerText = year;
    result.getElementsByTagName("img")[0].src = picture;
    
    result.dataset.resource = resource;
    
    results.appendChild(result);
    return result;
}
