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

function loadfile(){

}
