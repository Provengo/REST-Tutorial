const svc = new RESTSession("http://" + host + ":" + port, "provengo basedclient", {
    headers: { "Content-Type": "application/json" },
});

// Add a book to the store
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

// Add a user to the store
function addUser(id, name) {
    svc.post("/users", {
        body: JSON.stringify({
            id: id,
            name: name,
        }),
        parameters: {
            description: "Add a user with id " + id + " and name " + name
        }
    });
}

// Try to add a book that already exists
function tryToAddExistingBook(id, title) {
    svc.post("/books", {
        body: JSON.stringify({ id: id, title: title }),
        expectedResponseCodes: [400],
        parameters: {
            description: "Verify that we cannot add another book with id " + id + " and title " + title
        }
    });
}


deleteBook = function (id, title) {
    svc.delete("/books/" + id, {
        parameters: {
            description: "Delete a book with id " + id + " and title " + title
        }
    });
}

// Try to add a user that already exists
function tryToAddExistingUser(id, name) {
    svc.post("/users", {
        body: JSON.stringify({
            id: id,
            name: name,
        }),
        expectedResponseCodes: [400],
        parameters: {
            description: "Verify that we cannot add another user with id " + id + " and name " + name
        },
    });
}

// Verify that a user exists
function verifyUserExists(id, name) {
    svc.get("/users", {
        callback: function (response) {
            user = JSON.parse(response.body);
            for (let i = 0; i < user.length; i++) {
                if (user[i].id === id && user[i].name === name) {
                    return pvg.success("User exists");
                }
            }
            return pvg.fail("Expected a user to exists but it does not");
        },
        parameters: {
            description: "Verify user with id " + id + " and name " + name + " exists"
        },
    });
}

// Verify that a user does not exist
function verifyUserDoesNotExist(id, name) {
    svc.get("/users", {
        callback: function (response) {
            user = JSON.parse(response.body);
            for (let i = 0; i < user.length; i++) {
                if (user[i].id === id && user[i].name === name) {
                    return pvg.fail("Expected a user to not exist but it does");
                }
            }
            return pvg.success("User does not exist");
        },
        parameters: {
            description: "Verify user with id " + id + " and name " + name + " does not exist"
        },
    });
}


// Verify that a book exists
function verifyBookExists(id, title) {
    svc.get("/books", {
        callback: function (response) {
            book = JSON.parse(response.body);
            for (let i = 0; i < book.length; i++) {
                if (book[i].id === id && book[i].title === title) {
                    return pvg.success("Book exists");
                }
            }
            return pvg.fail("Expected a book to exists but it does not");
        },
        parameters: {
            description: "Verify book with id " + id + " and title " + title + " exists"

        }
    });
}

// Verify that a book does not exist
function verifyBookDoesNotExist(id, title) {
    svc.get("/books", {
        callback: function (response) {
            book = JSON.parse(response.body);
            for (let i = 0; i < book.length; i++) {
                if (book[i].id === id && book[i].title === title) {
                    return pvg.fail("Expected a book to not exist but it does");
                }
            }
            return pvg.success("Book does not exist");
        },
        parameters: {
            description: "Verify book with id " + id + " and title " + title + " does not exist"
        }
    });
}


// Helper functions for Loan API endpoints
function addLoan(userId, bookId) {
    svc.post("/loans", {
        body: JSON.stringify({
            bookId: bookId,
            userId: userId
        }),
        parameters: {
            description: "Add a loan with bookId " + bookId + " and userId " + userId
        }
    });
}

function deleteLoan(userId, bookId) {
    svc.delete("/loans", {
        body: JSON.stringify({
            bookId: bookId,
            userId: userId
        }),
        parameters: {
            description: "Delete a loan with bookId " + bookId + " and userId " + userId
        }
    });
}

function verifyLoanExists(userId, bookId) {
    svc.get("/loans", {
        callback: function (response) {
            const loans = JSON.parse(response.body);
            for (let i = 0; i < loans.length; i++) {
                if (loans[i].userId === userId && loans[i].bookId === bookId) {
                    return pvg.success("Loan exists");
                }
            }
            return pvg.fail("Expected a loan to exists but it does not");
        },
        parameters: {
            description: "Verify loan with userId " + userId + " and bookId " + bookId + " exists"
        },
    });
}

function verifyLoanDoesNotExist(userId, bookId) {
    svc.get("/loans", {
        callback: function (response) {
            const loans = JSON.parse(response.body);
            for (let i = 0; i < loans.length; i++) {
                if (loans[i].userId === userId && loans[i].bookId === bookId) {
                    return pvg.fail("Expected a loan to not exist but it does");
                }
            }
            return pvg.success("Loan does not exist");
        },
        parameters: {
            description: "Verify loan with userId " + userId + " and bookId " + bookId + " does not exist"
        },
    });
}

function tryToAddExistingLoan(userId, bookId) {
    svc.post("/loans", {
        body: JSON.stringify({
            userId: userId,
            bookId: bookId
        }),
        expectedResponseCodes: [400],
        parameters: {
            description: "Verify that we cannot add another loan with userId " + userId + " and bookId " + bookId
        }
    });
}

// Wait for an event with a specific description
function matchesDescription(description) {
    return bp.EventSet("test", function (e) {
        if (!e.data) return false;
        if (!e.data.parameters) return false;
        if (!e.data.parameters.description) return false;
        return e.data.parameters.description === description;
    });
}


function waitForBookAdded(id, title) {
    waitFor(matchesDescription("Add a book with id " + id + " and title " + title));
}

function waitForUserAdded(id, name) {
    waitFor(matchesDescription("Add a user with id " + id + " and name " + name));
}

function waitForLoanAdded(userId, bookId) {
    waitFor(matchesDescription("Add a loan with userId " + userId + " and bookId " + bookId));
}

function waitForLoanDeleted(userId, bookId) {
    waitFor(matchesDescription("Delete a loan with userId " + userId + " and bookId " + bookId));
}

function waitForUserDeleted(id, name) {
    waitFor(matchesDescription("Delete a user with id " + id + " and name " + name));
}

function waitForBookDeleted(id, title) {
    waitFor(matchesDescription("Delete a book with id " + id + " and title " + title));
}
