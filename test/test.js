const mocha = require("mocha");
const request = require('supertest');

// TODO(coenie): Change the tests below to improve branch coverage --
// the empty cases, i.e. where no ID or todo info is set, doesn't seem to
// execute the branches.

mocha.describe("To Do List", function() {
    let app;
    before(function () {
        app = require('../app');
    });
    after(function () {
        app.close();
    });
    mocha.describe("Test /", function() {
        it('Redirects to /todo -- returns 302 Found', function(done) {
            request(app).get('/').expect(302, done);
        });
        it('Redirects to /todo -- Location set to /todo', function(done) {
            request(app).get('/').expect("Location", "/todo", done);
        });
    });
    mocha.describe("Test /todo", function() {
        it('Responds 200 OK', function(done) {
            request(app).get('/todo').expect(200, done);
        });
        it('Body should contain content', function(done) {
            request(app).get('/todo').expect(function(res) {
                let cl = parseInt(res.headers['content-length']);
                if (!(cl >= 0)) throw new Error("Body is empty");
            }).end(done);
        });
    });
    mocha.describe("Test adding a todo /todo/add", function() {
        it('Responds 302 Found on GET', function(done) {
            request(app).get('/todo/add/').expect(302, done);
        });
        it('Adding a todo item redirects to /todo/', function(done) {
            request(app).post('/todo/add/')
                .send('newtodo=foo')
                .expect("Location", "/todo")
                .expect(302, done);
        });
        it('Test adding an empty todo', function(done) {
            request(app).post('/todo/add/')
                .expect("Location", "/todo")
                .expect(302, done);
        });
    });
    mocha.describe("Test deleting a todo /todo/delete/[ID]", function() {
        it('Responds 302 Found on GET', function(done) {
            request(app).get('/todo/delete/1')
                .expect(302, done);
        });
        it('Adding a todo item redirects to /todo/', function(done) {
            request(app).get('/todo/delete/1')
                .expect("Location", "/todo")
                .expect(302, done);
        });
        it('Adding not sending an ID to delete', function(done) {
            request(app).get('/todo/delete/')
                .expect("Location", "/todo")
                .expect(302, done);
        });
    });
    mocha.describe("Test editing a todo /todo/edit/[ID]", function() {
        it('Responds 302 Found on GET', function(done) {
            request(app).get('/todo/edit/1')
                .expect(302, done);
        });
        it('Editing a todo item redirects to /todo/', function(done) {
            request(app).post('/todo/edit/1')
                .send('newtodo=bar')
                .expect("Location", "/todo")
                .expect(302, done);
        });
        it('Test sending an empty ID to edit', function(done) {
            request(app).post('/todo/edit/')
                .expect("Location", "/todo")
                .expect(302, done);
        });
    });
});
