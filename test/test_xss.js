const mocha = require("mocha");
const request = require("supertest");

mocha.describe("To Do List - Check XSS", function() {
    let app;
    before(function () {
        app = require("../todo");
    });
    after(function () {
        app.close();
    });

    mocha.describe("Check XSS", function() {
        const test_url = "/todo/";
        const expected_ct = "application/json; charset=utf-8";

        const test_str = "foo";
        const test_data_clean = {todo: test_str};
        const test_data_clean_expect = {id: 0, todo: test_str};

        const test_str_xss = "<b>foo</b><script>alert('gotcha');</script>";
        const test_data_xss = {todo: test_str_xss};
        const test_data_xss_expect = {
            id: 0,
            todo: encodeURIComponent(test_str_xss),
        };

        it("Delete list contents.", function(done) {
            let expected_message = {"message": "Deleted."};
            request(app).delete(test_url + "0/")
                .expect('Content-Type', expected_ct)
                .expect(200, expected_message, done);
        });
        it("Create XSS todo should escape data", function (done) {
            request(app).post(test_url)
                .send(test_data_xss)
                .expect('Content-Type', expected_ct)
                .expect(201, test_data_xss_expect, done);
        });
        it("Create stores data in list", function(done) {
            request(app).get(test_url).expect([test_data_xss_expect], done);
        });
        it("Delete list contents.", function(done) {
            let expected_message = {"message": "Deleted."};
            request(app).delete(test_url + "0/")
                .expect('Content-Type', expected_ct)
                .expect(200, expected_message, done);
        });
        it("Create clean todo", function (done) {
            request(app).post(test_url)
                .send(test_data_clean)
                .expect('Content-Type', expected_ct)
                .expect(201, test_data_clean_expect, done);
        });
        it("Update todo with XSS should escape data", function (done) {
            request(app).patch(test_url + "0/")
                .send(test_data_xss)
                .expect('Content-Type', expected_ct)
                .expect(200, test_data_xss_expect, done);
        });
    });
});
