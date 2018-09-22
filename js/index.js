$(document).ready(function(){
    $('#add-json').click(function (e) {
        e.preventDefault();
        $('#error-msg').hide();
        let val = $('#json-holder').val();
        string2table(val, $('#table-block table'));
    });
    $('#load-json').click(function(e){
        e.preventDefault();
        $('#error-msg').hide();
        let json = rows2json($('#table-block table'));
        $('#json-holder').val(JSON.stringify(json));
    });
    $('#replace-json').click(function(e){
        e.preventDefault();
        $('#table-block table tbody').html('');
        $('#error-msg').hide();
        let val = $('#json-holder').val();
        string2table(val, $('#table-block table'));
    });
    $('#file-export').click(function (e) {
        e.preventDefault();
        let filename = '1.json';
        writefile(filename,$('#table-block table'));
    });
    $('#file-load').change(function (e) {
        $('#error-msg').hide();
        const input = this;
        const url = $(this).val();
        const ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
        if (input.files && input.files[0] && (ext === "csv" || ext === "json"))
        {
            const reader = new FileReader();
            reader.onload = function (e) {
                string2table(e.target.result,$('#table-block table'));
            };
            reader.readAsText(input.files[0]);
        }
        else
        {
            $('#error-msg').html('Error loading file').show();
        }
        const field = $(this);
        field.replaceWith(field.val('').clone(true));<<<<<
    })
});