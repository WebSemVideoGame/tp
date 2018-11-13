
// https://davidwalsh.name/query-string-javascript
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return (results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' ')));
};

// https://stackoverflow.com/questions/799981/document-ready-equivalent-without-jquery
function ready(action) {
  document.addEventListener("DOMContentLoaded", action);
}
