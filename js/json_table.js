function tableJsonify(elem){
    this.elem = elem;
}

tableJsonify.prototype.alertFunction = function() {
    const table = this.elem.querySelector('table');
    const tbody = this.elem.querySelector('tbody');
    const add_json = this.elem.querySelector('#add-json');
    const load_json = this.elem.querySelector('#load-json');
    const replace_json = this.elem.querySelector('#replace-json');
    const file_load = this.elem.querySelector('#file-load');
    const textarea = this.elem.querySelector('#json-holder');
    const error_msg = this.elem.querySelector('#error-msg');
    const file_export = this.elem.querySelector('#file-export');
    const change_format = this.elem.getElementsByName('file-format');

    // Constants for sorting
    const key_up = this.elem.querySelector('#key-up');
    const key_down = this.elem.querySelector('#key-down');
    const value_up = this.elem.querySelector('#value-up');
    const value_down = this.elem.querySelector('#value-down');

    const file_field = this.elem.querySelector('#hint');
    let format = 'json';

    add_json.addEventListener('click', function (e) {
        alert(1);
        e.preventDefault();
        error_msg.style.display = 'none';
        let val = textarea.value;
        if(format === 'csv'){
            val = JSON.stringify(csv2json(val));
        }
        try {
            string2table(val, table);
        }catch (e) {
            error_msg.style.display = 'block';
            error_msg.innerHTML= e.message;
        }
    });
    load_json.addEventListener('click',function(e){
        e.preventDefault();
        error_msg.style.display = 'none';
        try{
            let str = '';
            let json = rows2json(table);
            if(format === 'csv'){
                str = json2csv(json);
            }else {
                str = JSON.stringify(json);
            }
            textarea.value = str;
        }catch (e) {
            error_msg.innerHTML = e.message;
            error_msg.style.display = 'block';
        }
    });
    replace_json.addEventListener('click',function(e){
        e.preventDefault();
        error_msg.style.display = 'none';
        tbody.innerHTML = '';
        let val = textarea.value;
        if(format === 'csv'){
            val = JSON.stringify(csv2json(val));
        }
        try{
            string2table(val, table);
        }catch (e) {
            error_msg.innerHTML = e.message;
            error_msg.style.display = 'block';
        }
    });
    file_load.addEventListener('change', function (e) {
        error_msg.style.display = 'none';
        const input = this;
        const url = input.value;
        const ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
        try{
            if (input.files && input.files[0] && (ext === "csv" || ext === "json")) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    let text = e.target.result;
                    if(ext === 'csv') {
                        string2table(JSON.stringify(csv2json(text.substr(0,text.length))),table);
                    }
                    else {
                        string2table(text, table);
                    }
                };
                reader.readAsText(input.files[0]);
            }
            else {
                error_msg.innerHTML = 'Error load file';
                error_msg.style.display = 'block';
            }
        }catch (e) {
            error_msg.innerHTML = e.message;
            error_msg.style.display = 'block';
        }
        $(input).replaceWith($(input).val('').clone(true));
    });

    file_export.addEventListener('click',function (e) {
        e.preventDefault();
        let table_data = rows2json(table);
        if(format === 'csv') {
            write2file(json2csv(table_data),format);
        }else {
            write2file(JSON.stringify(table_data),format);
        }
    });

    //Sorting onclick actions implemented
    key_up.addEventListener('click',function (e) {
        e.preventDefault();
        let sort_array = rows2json(table);
        sort_array.sort(function (a, b) {
            let name_a = a.name.toLowerCase();
            let name_b = b.name.toLowerCase();
            if (name_a > name_b)
                return -1;
            else return 1;
        });
        tbody.innerHTML = '';
        sort_array.forEach(function (el) {
            tbody.append(obj2row(el));
        });
    });

    key_down.addEventListener('click',function (e) {
        e.preventDefault();
        let sort_array = rows2json(table);
        sort_array.sort(function (a, b) {
            let name_a = a.name.toLowerCase();
            let name_b = b.name.toLowerCase();
            if (name_a < name_b)
                return -1;
            else return 1;
        });
        tbody.innerHTML = '';
        sort_array.forEach(function (el) {
            tbody.append(obj2row(el));
        });
    });

    value_up.addEventListener('click',function (e) {
        e.preventDefault();
        let sort_array = rows2json(table);
        sort_array.sort(function (a, b) {
            let value_a = a.value.toLowerCase();
            let value_b = b.value.toLowerCase();
            if (value_a > value_b)
                return -1;
            else return 1;
        });
        tbody.innerHTML = '';
        sort_array.forEach(function (el) {
            tbody.append(obj2row(el));
        });
    });

    value_down.addEventListener('click',function (e) {
        e.preventDefault();
        let sort_array = rows2json(table);
        sort_array.sort(function (a, b) {
            let value_a = a.value.toLowerCase();
            let value_b = b.value.toLowerCase();
            if (value_a < value_b)
                return -1;
            else return 1;
        });
        tbody.innerHTML = '';
        sort_array.forEach(function (el) {
            tbody.append(obj2row(el));
        });
    });

    for(el in change_format){
        el.onclick = function () {
            alert(1);
        }
    }
    change_format.addEventListener('change',function () {
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
    let actions = '<button class="btn" onclick="edit_tr()"><span class="fa fa-pencil"></span></button>' +
        '<button class="btn" onclick="delete_tr()"><span class="fa fa-trash-o"></span></button>';
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
    return str.substr(0,str.length-1);
}

function delete_tr(e){
    console.log(1);
}

function save_tr(e){
    console.log(2);
    this.onclick = 'edit_tr()';
    $(this).find('span').removeClass('fa-save');
    $(this).find('span').addClass('fa-pencil');

    $(this).removeClass('save-action');
    $(this).addClass('edit-action');

    let key = $(this).parents('tr').find('td:nth-child(1)');
    let value = $(this).parents('tr').find('td:nth-child(2)');

    $(key).text($(key).find('input').val());
    $(value).text($(value).find('input').val());
}

function edit_tr(e){
    console.log(3);
    this.onclick = 'save_tr()';

    this.closest('fa-save')
    $(this).find('span').removeClass('fa-save');
    $(this).find('span').addClass('fa-pencil');

    let key = $(this).parents('tr').find('td:nth-child(1)');
    let value = $(this).parents('tr').find('td:nth-child(2)');

    $(key).text($(key).find('input').val());
    $(value).text($(value).find('input').val());

}
