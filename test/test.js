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
    mocha.describe("Test /", function() {
        it("GET returns 200", function(done) {
            request(app).get("/").expect(200, done);
        });
        it("GET returns data", function(done) {
            request(app).get("/todo").expect(function(res) {
                let cl = parseInt(res.headers['content-length']);
                if (!(cl >= 0)) throw new Error("Body is empty");
            }).end(done);
        });
        it("GET returns HTML", function(done) {
            request(app).get("/todo").expect(function(res) {
                let ct = res.headers['content-type'];
                let is_html = ct.includes("text/html");
                if (!is_html) throw new Error("No HTML returned.");
            }).end(done);
        });
    });
});
