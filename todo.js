const express = require('express');
const body_parser = require('body-parser');
const json_parser = body_parser.json();

const app = express();
const port = 8080;
let todo_list = [];

app.use(json_parser);

function read_index(req, res) {
    res.status(200).render("index.ejs", {});
    console.debug("Rendering index.");
}

function list_todo(req, res) {
    let output_list = [];
    todo_list.forEach((value, index) => {
        output_list.push({id: index, todo: value});
    });
    console.debug("Returning list of " + output_list.length + " items.");
    res.status(200).json(output_list);
}

function create_todo(req, res) {
    let return_status = 500;
    let return_data = {error: "Unknown error."};

    let todo_provided = "todo" in req.body;
    let todo_empty = req.body.todo === "";

    if (!todo_provided) {
        return_status = 400;
        return_data.error = "Field 'todo' required.";
        console.error("Field 'todo' not provided.");
    }

    if (todo_provided && todo_empty) {
        return_status = 400;
        return_data.error = "Field 'todo' cannot be empty.";
        console.error("Field 'todo' is empty.");
    }

    if (todo_provided && !todo_empty) {
        let escaped_todo = encodeURIComponent(req.body.todo);
        escaped_todo = escaped_todo.replace("%20", " ");
        let idx = todo_list.push(escaped_todo) -1;
        return_status = 201;
        return_data = {id: idx, todo: escaped_todo};
        console.info("Created new todo: " + escaped_todo);
    }

    res.status(return_status).json(return_data);
}

function delete_todo(req, res) {
    let return_status = 500;
    let return_data = {error: "Unknown error."};

    let request_id = parseInt(req.params.id);

    if (request_id < 0) {
        return_status = 400;
        return_data = {error: "Negative IDs not allowed."};
        console.error("Negative IDs not allowed.");
    }

    if (request_id > todo_list.length - 1) {
        return_status = 400;
        return_data = {error: "ID does not exist."};
        console.error("ID does not exist.");
    }

    if (request_id >= 0 && request_id <= todo_list.length - 1) {
        todo_list.splice(request_id, 1);
        return_status = 200;
        return_data = {message: "Deleted."};
        console.info("Item id " + request_id + " deleted.");
    }
    res.status(return_status).json(return_data);
}

function update_todo(req, res) {
    let return_status = 500;
    let return_data = {error: "Unknown error."};

    let request_id = parseInt(req.params.id);
    let requested_todo = todo_list[request_id];

    let item_defined = typeof requested_todo !== "undefined";
    let todo_provided = "todo" in req.body;
    let todo_empty = req.body.todo === "";

    if(!item_defined) {
        return_status = 400;
        return_data = {error: "Requested item does not exist."};
        console.error("Requested todo does not exist.");
    }

    if (item_defined && !todo_provided) {
        return_status = 400;
        return_data.error = "Field 'todo' required.";
        console.error("Field todo required for update.");
    }

    if (item_defined && todo_provided && todo_empty) {
        return_status = 400;
        return_data.error = "Field 'todo' cannot be empty.";
        console.error("Field todo cannot be empty.");
    }

    if (item_defined && todo_provided && !todo_empty) {
        console.error("Updating todo, original:" + todo_list[request_id]);
        let escaped_todo = encodeURIComponent(req.body.todo);
        escaped_todo = escaped_todo.replace("%20", " ");
        todo_list[request_id] = escaped_todo;
        return_status = 200;
        return_data = {id: request_id, todo: escaped_todo};
        console.error("Updated todo, new:" + JSON.stringify(return_data));
    }

    res.status(return_status).json(return_data);
}

// NOTE(coenie): Render the index page which handles the client side
// interaction.
app.get("/", read_index);
app.get("/todo/", list_todo);
app.post("/todo/", create_todo);
app.delete("/todo/:id", delete_todo);
app.patch("/todo/:id", update_todo);

let status_str = `My To Do list running on port ${port}!`;
module.exports = app.listen(port, () => console.log(status_str));
