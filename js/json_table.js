$.fn.jsonTable = function(){
    //Initialize variables
    const table_block = this;
    const table = $(this).find('table');
    const tbody = $(table).find('tbody');
    const textarea = $(this).find('#json-holder');
    const error_msg = $(this).find('#error-msg');
    const file_field = $('input[name="file-format"]');
    let format = 'json';

    //Actions on main area
    table_block.on('click','#add-json', function (e) {
        e.preventDefault();
        $(error_msg).hide();
        let val = $(textarea).val();
        if(format === 'csv'){
            val = JSON.stringify(csv2json(val));
        }
        try {
            string2table(val, $(table));
        }catch (e) {
            $(error_msg).html(e.message).show();
        }
    }).on('click','#load-json', function(e){
        e.preventDefault();
        $(error_msg).hide();
        try{
            let str = '';
            let json = rows2json($(table));
            if(format === 'csv'){
                str = json2csv(json);
            }else {
                str = JSON.stringify(json);
            }
            $(textarea).val(str);
        }catch (e) {
            $(error_msg).html(e.message).show();
        }
    }).on('click','#replace-json', function(e){
        e.preventDefault();
        $(error_msg).hide();
        $(tbody).html('');
        $(error_msg).hide();
        let val = $(textarea).val();
        if(format === 'csv'){
            val = JSON.stringify(csv2json(val));
        }
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
        try{
            if (input.files && input.files[0] && (ext === "csv" || ext === "json")) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    let text = e.target.result;
                    if(ext === 'csv') {
                        string2table(csv2json(text),$(table));
                    }
                    else {
                        string2table(text, $(table));
                    }
                };
                reader.readAsText(input.files[0]);
            }
            else {
                $(error_msg).html('Error loading file').show();
            }
        }catch (e) {
            $(error_msg).html(e.message).show();
        }
        $(input).replaceWith($(input).val('').clone(true));
    }).on('click', '#file-export', function (e) {
        e.preventDefault();
        let table_data = rows2json($(table));
        if(format === 'csv') {
            write2file(json2csv(table_data),format);
        }else {
            write2file(JSON.stringify(table_data),format);
        }
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
    }).on('click', '#key-up', function (e) {
        e.preventDefault();
        let sort_array = rows2json($(table));
        sort_array.sort(function (a, b) {
            let name_a = a.name.toLowerCase();
            let name_b = b.name.toLowerCase();
            return name_a > name_b;
        });
        $(tbody).html('');
        sort_array.forEach(function (el) {
            $(tbody).append(obj2row(el));
        });
    }).on('click', '#key-down', function (e) {
        e.preventDefault();
        let sort_array = rows2json($(table));
        sort_array.sort(function (a, b) {
            let name_a = a.name.toLowerCase();
            let name_b = b.name.toLowerCase();
            return name_a < name_b;
        });
        $(tbody).html('');
        sort_array.forEach(function (el) {
            $(tbody).append(obj2row(el));
        });
    }).on('click', '#value-up', function (e) {
        e.preventDefault();
        let sort_array = rows2json($(table));
        sort_array.sort(function (a, b) {
            let value_a = a.value.toLowerCase();
            let value_b = b.value.toLowerCase();
            return value_a > value_b;
        });
        $(tbody).html('');
        sort_array.forEach(function (el) {
            $(tbody).append(obj2row(el));
        });
    }).on('click', '#value-down', function (e) {
        e.preventDefault();
        let sort_array = rows2json($(table));
        sort_array.sort(function (a, b) {
            let value_a = a.value.toLowerCase();
            let value_b = b.value.toLowerCase();
            return value_a < value_b;
        });
        $(tbody).html('');
        sort_array.forEach(function (el) {
            $(tbody).append(obj2row(el));
        });
    }).on('click', 'input[name="file-format"]', function () {
        format = $(this).data('type');
        let text_json = '[{"name":"<code>your name</code>","value":"<code>your value</code>"},{"name":"<code>your second name</code>","value":"<code>your second value</code>"}]';
        let text_csv = '<code>Yourname</code>,<code>Yourvalue</code><br><code>Yourname</code>,<code>Yourvalue</code>';
        if(format === 'csv') {
            $(file_field).html(text_csv);
        }else {
            $(file_field).html(text_json);
        }
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

function write2file(string2write, format){
    const a = document.createElement("a");
    const data_format = (format === 'csv') ? 'text/csv' : 'application/json';
    const filename = 'export_table.'+format;
    a.href = "data:"+data_format+"," + encodeURIComponent(string2write);
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    setTimeout(function () {
        a.click();
        document.body.removeChild(a);
    }, 200);
}

function csv2json(str) {
    let rows = str.split('\n');
    let result = [];
    rows.forEach(function (el) {
        let obj = el.split(',');
        result.push({name:obj[0], value:obj[1]});
    });
    return result;
}

function json2csv(obj) {
    let str = '';
    obj.forEach(function (el) {
        str += el.name + ',' + el.value + '\n';
    });
    return str.substr(0,str.length);
}
