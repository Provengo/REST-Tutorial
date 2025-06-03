# Testing REST APIs with Provengo Tutorial

This tutorial demonstrates how to use Provengo to test REST APIs through a simple Library Management System example.

## System Under Test

Our system under test is a Library Management System that exposes a REST API with the following endpoints:

- `/users` - Create, read, delete user records
- `/books` - Create, read, delete book records  
- `/loans` - Create, read, delete loan records linking users to books

Each entity (user, book, loan) supports basic CRUD operations through standard HTTP methods (POST, GET, DELETE).

## Creating a Clean Testing Interface

Rather than directly calling REST endpoints in our tests, we create a clean testing interface that wraps the raw HTTP calls. This interface layer is defined in `interface.js`.

### Basic CRUD Operations

Here's an example of how we wrap a REST call into a clean function:

```javascript
function addBook(id, title) {
    svc.post("/books", {
        body: JSON.stringify({
            id: id,
            title: title,
        }),
        parameters: {
            description: "Add a book with id " + id + " and title " + title
        }
    });
}
```

The function:
1. Takes simple parameters instead of JSON
2. Handles content-type and serialization 
3. Adds a description that helps with test reporting
4. Returns a clean success/failure result

### Event Matching and Waiting

We also create utilities for waiting for and matching specific events:

```javascript
function waitForAnyBookAdded() {
    let e = waitFor(matchAnyAddBook());
    let id = e.data.parameters.description.match(/id (\d+)/)[1];
    let title = e.data.parameters.description.match(/title (.+)$/)[1];
    return { id: +id, title: title };
}
```

This allows test code to synchronize on API operations without dealing with async/await or promises.

## Linear Testing Approach

The simplest way to test our API is with a linear sequence of operations. In `spec\js\a_linear_test.js.js`, we have a "LINEAR" scenario that demonstrates this:

```javascript 
bthread("Loan API", function () {
    addUser(111, "John Doe");
    addBook(222, "The Great Gatsby");
    addLoan(111, 222);
    tryToAddExistingLoan(111, 222);
    verifyLoanExists(111, 222);
    verifyUserExists(111, "John Doe");
    verifyBookExists(222, "The Great Gatsby"); 
});
```

This linear approach:
- Tests basic functionality
- Is easy to understand
- Provides clear success/failure paths
- Limited in coverage

## Model-Based Testing Approach

To increase test coverage and find edge cases, we can run multiple scenarios in parallel. The model in `spec\js\a_testing_model.js` demonstrates this:

```javascript
bthread("Librarian", function () {
    waitForAnyUserAdded();
    addBook(201, "The Great Gatsby");
    waitForAnyUserAdded();
    addBook(202, "1984");
});

bthread("John's Loan", function () {
    addUser(100, "John Doe");
    let book = waitForAnyBookAdded();
    addLoan(100, book.id);
    // ...more operations
});

bthread("Jane's Loan", function () {
    addUser(101, "Jane Smith");
    let book = waitForAnyBookAdded();
    addLoan(101, book.id);
    // ...more operations
});
```

The parallel approach:
- Runs multiple scenarios concurrently
- Tests race conditions and timing issues
- Increases test coverage through interleaving
- Uses event synchronization to coordinate between threads

### Verification Threads

We also add dedicated verification threads that monitor operations:

```javascript
bthread("User add verification", function () {
    user = waitForAnyUserAdded();
    block(matchDeleteUser(user.id, user.name), function () {
        verifyUserExists(user.id, user.name);
    });
});
```

These threads:
- Monitor specific operations
- Enforce ordering constraints
- Verify system invariants
- Prevent race conditions

## Running the Tests

The tests can be run using PowerShell scripts:

1. Start the system under test:
```powershell
python sut.py
```

2. Run the tests:
```powershell
provengo run BookStoreDemo --before="python reset.py"
```

> **Info**: The `--before` option executes a preparation script before each test run. In this case, `reset.py` makes a POST request to the `/reset` endpoint of our API, which clears all existing books, users, and loans. This ensures each test starts with a known, clean state - a crucial practice for maintaining test reliability and preventing interference between test runs.

> **Info**: The above command runs the linear tests. To run the parallel tests, use the `-c mode=PARALLEL` option:
`
provengo -c mode=PARALLEL run BookStoreDemo --before="python reset.py" 
`

> **Info**: To improve readability of the output, you can run the `run_stest.ps1` script, which pos-processes the output of the `provengo run` command to make it more readable.

3. Run `20` tests in parallel mode and get a report:
```powershell
provengo -c mode=PARALLEL sample --overwrite --size 20 BookStoreDemo
provengo -c mode=PARALLEL run -s products\run-source\samples.json --before="python reset.py" BookStoreDemo 
provengo -c mode=PARALLEL report --suites :last BookStoreDemo
```

> **Info**: To get a more readable output, use the  `run_some_and_report.ps1` script which pos-processes the output of the `provengo run` command to make it more readable.

## Conclusion

This tutorial demonstrated how to:
1. Create a clean testing interface for REST APIs
2. Write linear tests for basic functionality
3. Use parallel scenarios for increased coverage
4. Add verification monitors for system invariants
5. Run and report test results

The combination of clean interfaces, parallel scenarios, and verification monitors allows us to thoroughly test REST APIs while keeping the test code maintainable and understandable.
