const express = require('express');
const body_parser = require('body-parser');
const json_parser = body_parser.json();

const app = express();
const port = 8080;
let todo_list = [];

app.use(json_parser);

function render_index(req, res) {
    res.status(200).render("index.ejs", {});
}

// NOTE(coenie): Render the index page which handles the client side
// interaction.
app.get("/", render_index);

let status_str = `My To Do list running on port ${port}!`;
module.exports = app.listen(port, () => console.log(status_str));
