const mocha = require("mocha");
const request = require('supertest');

mocha.describe("Test /", function() {
        let app;
        beforeEach(function () {
            app = require('../app');
        });
        afterEach(function () {
            app.close();
        });
    it('Responds 302 Found', function(done) {
        request(app).get('/').expect(302, done);
    });
});
