$.fn.jsonTable = function(){
    //Initialize variables
    const table_block = this;
    const table = $(this).find('table');
    const tbody = $(table).find('tbody');
    const textarea = $(this).find('#json-holder');
    const error_msg = $(this).find('#error-msg');

    //Actions on main area
    table_block.on('click','#add-json', function (e) {
        e.preventDefault();
        $(error_msg).hide();
        let val = $(textarea).val();
        try {
            string2table(val, $(table));
        }catch (e) {
            $(error_msg).html(e.message).show();
        }
    }).on('click','#load-json', function(e){
        e.preventDefault();
        $(error_msg).hide();
        try{
            let json = rows2json($(table));
            $(textarea).val(JSON.stringify(json));
        }catch (e) {
            $(error_msg).html(e.message).show();
        }
    }).on('click','#replace-json', function(e){
        e.preventDefault();
        $(error_msg).hide();
        $(tbody).html('');
        $(error_msg).hide();
        let val = $(textarea).val();
        try{
            string2table(val, $(table));
        }catch (e) {
            $(error_msg).html(e.message).show();
        }
    }).on('change','#file-load',function (e) {
        $(error_msg).hide();
        const input = this;
        const url = $(this).val();
        const ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
        if (input.files && input.files[0] && (ext === "csv" || ext === "json")) {
            const reader = new FileReader();
            reader.onload = function (e) {
                string2table(e.target.result,$(table));
            };
            reader.readAsText(input.files[0]);
        }
        else {
            $(error_msg).html('Error loading file').show();
        }
        input.replaceWith(input.val('').clone(true));
    }).on('click', '.delete-action', function(){
        $(this).parents('tr').remove();
    }).on('click', '.edit-action', function(){
        $(this).find('span').removeClass('fa-pencil');
        $(this).find('span').addClass('fa-save');

        $(this).removeClass('edit-action');
        $(this).addClass('save-action');

        let key = $(this).parents('tr').find('td:nth-child(1)');
        let value = $(this).parents('tr').find('td:nth-child(2)');

        $(key).html('<input type="text" value="'+$(key).text()+'"/>');
        $(value).html('<input type="text" value="'+$(value).text()+'"/>');
    }).on('click', '.save-action', function(){
        $(this).find('span').removeClass('fa-save');
        $(this).find('span').addClass('fa-pencil');

        $(this).removeClass('save-action');
        $(this).addClass('edit-action');

        let key = $(this).parents('tr').find('td:nth-child(1)');
        let value = $(this).parents('tr').find('td:nth-child(2)');

        $(key).text($(key).find('input').val());
        $(value).text($(value).find('input').val());
    });
};

function string2table(string, table){
    $.parseJSON(string).forEach(function(el){
        $(table).find('tbody').append(obj2row(el));
    });
}

function rows2json(table){
    let tbody = $(table).find('tbody');
    var array = [];
    tbody.find('tr').each(function(){
        let name = $(this).find('td:nth-child(1)').text();
        let value = $(this).find('td:nth-child(2)').text();
        array.push({name:name, value:value});
    });
    return array;
}

function obj2row(obj){
    let tr = $('<tr></tr>');
    let td = $('<td></td>');
    let actions = '<button class="btn edit-action"><span class="fa fa-pencil"></span></button>' +
        '<button class="btn delete-action"><span class="fa fa-trash-o"></span></button>';
    tr.append(td.clone().text(obj.name)).append(td.clone().text(obj.value)).append(td.clone().html(actions));
    return tr;
}

function writefile(filename, table){
    let file = new File([""], filename);
    file.open("w"); // open file with write access
    file.writeln(JSON.stringify(rows2json(table)));
    file.close();
}
