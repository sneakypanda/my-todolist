# Todo list exercise

### Install

- Install https://nodejs.org/en/
- Download archive from link provided
- Unzip file and cd into it
- run `npm install`

### Run
`node app.js`

Visit http://localhost:8080 in your browser

### High level application requirements
1. Multiple users should be able to view the shared public todo list
2. Should be able to add items
3. Should be able to delete items
4. Should be able to edit items (Missing feature)
5. Must be able to deploy in docker (Missing feature)

### Tasks
1. Add missing requirement #4 to the application
2. Add sufficient test coverage to the application and update readme on howto run the tests
3. Add missing requirement #5 to the application (Dockerfile and update readme with instructions)

### Bonus
4. Display test coverage after tests are executed
5. Find and fix the XSS vulnerability in the application. Also make sure that it wont happen again by including a test.

> ### Notes
> - Update the code as needed and document what you have done in the readme below
> - Will be nice if you can git tag the tasks by number

### Solution
#### Task 1
In the template I added a javascript function which triggers when clicking the edit (pencil) button.
This function changes the existing form to instead display the item to be edited and then submit it to the edit endpoint.
I then added the edit endpoint using the route /todo/edit/:id which updates the submitted todo item.

#### Task 2
Added testing using mocha and supertest.
Coverage is checked using sinon.
Install the dependencies using `npm install`.
Run the tests with coverage using `npm test`.

#### Bonus 4
Coverage is measured using sinon and mocha -- run tests with coverage using `npm test`.

