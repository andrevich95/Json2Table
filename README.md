# Json2Table
jQuery plugin for converting JSON to table and table to JSON

Copyright (C) 2018 Andr Evich

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

<h2>Installation</h2>
Install npm and run <code>npm update</code>

Create html block with table the same structure
<code>
<div id="table-block">
            <table class="table table-striped">
                <thead class="thead-dark">
                    <tr>
                        <th>Name</th>
                        <th>Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            <p class="alert alert-danger" id="error-msg" style="display:none"></p>
            <form enctype="multipart/form-data">
                <div class="form-group">
                    <label for="json-holder" class="alert alert-primary">Textarea format: [{"name":"<code>your name</code>","value":"<code>your value</code>"}]</label>
                    <textarea class="form-control" id="json-holder" cols="40" rows="5" placeholder="Input Json Data"></textarea>
                    <button class="btn btn-primary" id="add-json">ADD TO TABLE</button>
                    <button class="btn btn-primary" id="replace-json">REPLACE TABLE DATA</button>
                    <button class="btn btn-primary" id="load-json">LOAD TO TEXT AREA</button>
                    <input class="btn btn-success" type="file" id="file-load" accept="application/json" placeholder="LOAD JSON/CSV">
                    <button class="btn btn-success" id="file-export">EXPORT FILE</button>
                </div>
            </form>
  </div>
</code>

In your js init table
<code>$('#table-block').jsonTable();</code>
