const mocha = require("mocha");
const request = require("supertest");

mocha.describe("To Do List - Update Items", function() {
    let app;
    before(function () {
        app = require("../todo");
    });
    after(function () {
        app.close();
    });

    mocha.describe("Update /todo/", function() {
        const test_url = "/todo/";
        const expected_ct = "application/json; charset=utf-8";

        const test_str_original = "foo";
        const test_data_original = {todo: test_str_original};
        const test_data_original_expect = {id: 0, todo: test_str_original};

        const test_data_bad_field_name = {foo: ""};
        const test_data_bad_field_name_response = {
            error: "Field 'todo' required."
        };
        const test_data_empty_field = {todo: ""};
        const test_data_empty_field_response = {
            error: "Field 'todo' cannot be empty."
        };

        const test_str_new = "bar";
        const test_data_new = {todo: test_str_new};
        const test_data_new_expect = {id: 0, todo: test_str_new};

        it("Create data.", function (done) {
            request(app).post(test_url)
                .send(test_data_original)
                .expect('Content-Type', expected_ct)
                .expect(201, test_data_original_expect, done);
        });
        it("Ensure data in list", function(done) {
            request(app).get(test_url)
                .expect('Content-Type', expected_ct)
                .expect([test_data_original_expect], done);
        });
        it("Updating a non existing ID should fail.", function (done) {
            let expected_error = {error: "Requested item does not exist."};
            let test_data = {"todo": ""};
            request(app).patch(test_url + "1/")
                .send(test_data)
                .expect('Content-Type', expected_ct)
                .expect(400, expected_error, done);
        });
        it("Update requires todo field", function (done) {
            request(app).patch(test_url + "0/")
                .send(test_data_bad_field_name)
                .expect('Content-Type', expected_ct)
                .expect(400, test_data_bad_field_name_response, done);
        });
        it("Create requires non-empty todo field", function (done) {
            request(app).patch(test_url + "0/")
                .send(test_data_empty_field)
                .expect('Content-Type', expected_ct)
                .expect(400, test_data_empty_field_response, done);
        });
        it("Updates should work as expected", function (done) {
            request(app).patch(test_url + "0/")
                .send(test_data_new)
                .expect('Content-Type', expected_ct)
                .expect(200, test_data_new_expect, done);
        });
        it("Ensure the correct data is in the list", function(done) {
            request(app).get(test_url)
                .expect('Content-Type', expected_ct)
                .expect([test_data_new_expect], done);
        });
    });
});
