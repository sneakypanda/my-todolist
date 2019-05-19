const mocha = require("mocha");
const request = require("supertest");

mocha.describe("To Do List - Index", function() {
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
});
