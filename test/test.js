const mocha = require("mocha");
const request = require("supertest");

mocha.describe("To Do List", function() {
    let app;
    before(function () {
        app = require("../todo");
    });
    after(function () {
        app.close();
    });

    mocha.describe("Read /", function() {
        const test_url = "/";
        const expected_ct = "text/html; charset=utf-8";

        it("Read returns 200", function(done) {
            request(app).get(test_url).expect(200, done);
        });
        it("Read returns HTML", function(done) {
            request(app).get(test_url)
                .expect('Content-Type', expected_ct, done);
        });
        it("Read returns data", function(done) {
            request(app).get(test_url).expect(function(res) {
                let cl = parseInt(res.headers['content-length']);
                if (!(cl >= 0)) throw new Error("Body is empty");
            }).end(done);
        });
    });
    mocha.describe("List /todo/", function() {
        const test_url = "/todo/";
        const expected_ct = "application/json; charset=utf-8";

        it("List returns 200", function (done) {
            request(app).get(test_url).expect(200, done);
        });
        it("List returns JSON", function(done) {
            request(app).get(test_url)
                .expect('Content-Type', expected_ct, done);
        });
     });
     mocha.describe("Create /todo/", function() {
         const test_url = "/todo/";
         const expected_ct = "application/json; charset=utf-8";
         const test_data_bad_field_name = {foo: ""};
         const test_data_bad_field_name_response = {
             error: "Field 'todo' required."
         };
         const test_data_empty_field = {todo: ""};
         const test_data_empty_field_response = {
             error: "Field 'todo' cannot be empty."
         };

         const test_str = "foo";
         const test_data_good = {todo: test_str};
         const test_data_good_expect = {id: 0, todo: test_str};
         it("Create requires todo field", function (done) {
             request(app).post(test_url)
                 .send(test_data_bad_field_name)
                 .expect('Content-Type', expected_ct)
                 .expect(400, test_data_bad_field_name_response, done);
         });
         it("Create requires non-empty todo field", function (done) {
            request(app).post(test_url)
                .send(test_data_empty_field)
                .expect('Content-Type', expected_ct)
                .expect(400, test_data_empty_field_response, done);
         });
         it("Create with good data returns 201, data and JSON", function (done) {
            request(app).post(test_url)
                .send(test_data_good)
                .expect('Content-Type', expected_ct)
                .expect(201, test_data_good_expect, done);
         });
         it("Create stores data in list", function(done) {
            request(app).get(test_url).expect([test_data_good_expect], done);
         });
    });
    mocha.describe("Delete /todo/", function() {
        const test_url = "/todo/";
        const expected_ct = "application/json; charset=utf-8";
        const test_str = "foo";
        const test_data_good_expect = [{id: 0, todo: test_str}];

        // NOTE(coenie): We expect an item from the previous create tests to
        // still be in the list.
        it("Ensure data in list", function(done) {
            request(app).get(test_url)
                .expect('Content-Type', expected_ct)
                .expect(test_data_good_expect, done);
        });
        it("Negative IDs not allowed", function(done) {
            let expected_error = {"error": "Negative IDs not allowed."};
            request(app).delete("/todo/-1/")
                .expect('Content-Type', expected_ct)
                .expect(400, expected_error, done);
        });
        it("Only existing IDs allowed.", function(done) {
            let expected_error = {"error": "ID does not exist."};
            request(app).delete("/todo/1/")
                .expect('Content-Type', expected_ct)
                .expect(400, expected_error, done);
        });
        it("Valid delete works as expected.", function(done) {
            let expected_message = {"message": "Deleted."};
            request(app).delete("/todo/0/")
                .expect('Content-Type', expected_ct)
                .expect(200, expected_message, done);
        });
        it("Ensure list is now empty", function(done) {
            request(app).get(test_url)
                .expect('Content-Type', expected_ct)
                .expect([], done);
        });
    });
});
