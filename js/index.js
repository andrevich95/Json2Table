document.addEventListener("DOMContentLoaded", function(event) {
    let mytable = new tableJsonify(document.getElementById('table-block'));
    mytable.alertFunction();
});
