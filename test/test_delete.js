const mocha = require("mocha");
const request = require("supertest");

mocha.describe("To Do List - Delete Items", function() {
    let app;
    before(function () {
        app = require("../todo");
    });
    after(function () {
        app.close();
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
            request(app).delete(test_url + "-1/")
                .expect('Content-Type', expected_ct)
                .expect(400, expected_error, done);
        });
        it("Only existing IDs allowed.", function(done) {
            let expected_error = {"error": "ID does not exist."};
            request(app).delete(test_url + "1/")
                .expect('Content-Type', expected_ct)
                .expect(400, expected_error, done);
        });
        it("Valid delete works as expected.", function(done) {
            let expected_message = {"message": "Deleted."};
            request(app).delete(test_url + "0/")
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
