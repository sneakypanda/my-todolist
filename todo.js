const express = require('express');
const body_parser = require('body-parser');
const json_parser = body_parser.json();

const app = express();
const port = 8080;
let todo_list = [];

app.use(json_parser);

function read_index(req, res) {
    res.status(200).render("index.ejs", {});
}

function list_todo(req, res) {
    let output_list = [];
    todo_list.forEach((value, index) => {
        output_list.push({id: index, todo: value});
    });
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
    }

    if (todo_provided && todo_empty) {
        return_status = 400;
        return_data.error = "Field 'todo' cannot be empty.";
    }

    if (todo_provided && !todo_empty) {
        let idx = todo_list.push(req.body.todo) -1;
        return_status = 201;
        return_data = {id: idx, todo: req.body.todo}
    }

    res.status(return_status).json(return_data);
}

function delete_todo(req, res) {
    let return_status = 500;
    let return_data = {"error": "Unknown error."};

    let request_id = parseInt(req.params.id);

    if (request_id < 0) {
        return_status = 400;
        return_data = {"error": "Negative IDs not allowed."};
    }

    if (request_id > todo_list.length - 1) {
        return_status = 400;
        return_data = {"error": "ID does not exist."};
    }
    if (request_id >= 0 && request_id <= todo_list.length - 1) {
        todo_list.splice(request_id, 1);
        return_status = 200;
        return_data = {"message": "Deleted."};
    }
    res.status(return_status).json(return_data);
}

// NOTE(coenie): Render the index page which handles the client side
// interaction.
app.get("/", read_index);
app.get("/todo/", list_todo);
app.post("/todo/", create_todo);
app.delete("/todo/:id", delete_todo);

let status_str = `My To Do list running on port ${port}!`;
module.exports = app.listen(port, () => console.log(status_str));
