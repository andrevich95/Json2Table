$(document).ready(function(){
    $('#add-json').click(function (e) {
        e.preventDefault();
        $('#error-msg').hide();
        let val = $('#json-holder').val();
        string2table(val, $('#table-block table'))
    });
});