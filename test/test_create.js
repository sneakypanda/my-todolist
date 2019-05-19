const mocha = require("mocha");
const request = require("supertest");

mocha.describe("To Do List - Create Items", function() {
    let app;
    before(function () {
        app = require("../todo");
    });
    after(function () {
        app.close();
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
});
