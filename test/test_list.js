const mocha = require("mocha");
const request = require("supertest");

mocha.describe("To Do List - List Items", function() {
    let app;
    before(function () {
        app = require("../todo");
    });
    after(function () {
        app.close();
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

});
