/**
 * REST service instance for communicating with the book store API
 */
const svc = new RESTSession("http://" + host + ":" + port, "provengo basedclient", {
    headers: { "Content-Type": "application/json" },
});

/**
 * Book Management Operations
 * These functions handle CRUD operations for books in the store
 */

/**
 * Adds a new book to the store
 * @param {number} id - The unique identifier for the book
 * @param {string} title - The title of the book
 */
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

/**
 * Deletes a book from the store
 * @param {number} id - The unique identifier of the book to delete
 * @param {string} title - The title of the book to delete
 */
function deleteBook(id, title) {
    svc.delete("/books/" + id, {
        parameters: {
            description: "Delete a book with id " + id + " and title " + title
        }
    });
}


/**
 * Trying to delete a book that does not exist or is in loan (should fail)
 * @param {number} id - The ID of the book to delete
 * @param {string} title - The title of the book to delete
 */
function tryToDeleteNonExistentBookOrInLoan(id, title) {
    svc.delete("/books/" + id, {
        expectedResponseCodes: [400],
        parameters: {
            description: "Verify that we cannot delete a book with id " + id + " and title " + title + " that does not exist or is in loan"
        }
    });
}


/**
 * Attempts to add a book that already exists (should fail)
 * @param {number} id - The ID of the existing book
 * @param {string} title - The title of the existing book
 */
function tryToAddExistingBook(id, title) {
    svc.post("/books", {
        body: JSON.stringify({ id: id, title: title }),
        expectedResponseCodes: [400],
        parameters: {
            description: "Verify that we cannot add another book with id " + id + " and title " + title
        }
    });
}

/**
 * Verifies that a specific book exists in the store
 * @param {number} id - The book ID to check
 * @param {string} title - The book title to check
 */
function verifyBookExists(id, title) {
    svc.get("/books", {
        callback: function (response) {
            book = JSON.parse(response.body);
            for (let i = 0; i < book.length; i++) {
                if (book[i].id === id && book[i].title === title) {
                    return pvg.success("Book exists");
                }
            }
            return pvg.fail("Expected a book with id " + id + " and title " + title + " to exists but it does not");
        },
        parameters: {
            description: "Verify book with id " + id + " and title '" + title + "' exists"
        }
    });
}

/**
 * Verifies that a specific book does not exist in the store
 * @param {number} id - The book ID to check
 * @param {string} title - The book title to check
 */
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

/**
 * User Management Operations
 * These functions handle CRUD operations for users in the store
 */

/**
 * Adds a new user to the store
 * @param {number} id - The unique identifier for the user
 * @param {string} name - The name of the user
 */
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

/**
 * Attempts to add a user that already exists (should fail)
 * @param {number} id - The ID of the existing user
 * @param {string} name - The name of the existing user
 */
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

/**
 * Verifies that a specific user exists in the store
 * @param {number} id - The user ID to check
 * @param {string} name - The user name to check
 */
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

/**
 * Verifies that a specific user does not exist in the store
 * @param {number} id - The user ID to check
 * @param {string} name - The user name to check
 */
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


/**
 * Deletes a user from the store
 * @param {number} id - The unique identifier of the user to delete
 * @param {string} name - The name of the user to delete
 */
function deleteUser(id, name) {
    // Delete user by ID and include the name in the description for clarity
    svc.delete("/users", {
        body: JSON.stringify({
            id: id
        }),
        parameters: {
            description: "Delete user with id " + id + " and name " + name
        }
    });
}

/**
 * Trying to delete a user that does not exist or has loans (should fail)
 * @param {number} id - The ID of the user to delete
 * @param {string} name - The name of the user to delete
 */
function tryToDeleteNonExistentUserOrInLoan(id, name) {
    svc.delete("/users/" + id, {
        expectedResponseCodes: [400,404], // 400 for bad request, 404 for not found
        parameters: {
            description: "Verify that we cannot delete a user with id " + id + " and name " + name + " that does not exist or has loans"
        }
    });
}

/**
 * Loan Management Operations
 * These functions handle CRUD operations for book loans
 */

/**
 * Creates a new loan record
 * @param {number} userId - The ID of the user borrowing the book
 * @param {number} bookId - The ID of the book being borrowed
 */
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

/**
 * Deletes a loan record
 * @param {number} userId - The ID of the user who the loan belongs to
 * @param {number} bookId - The ID of the book that is loaned
 */
function deleteLoan(userId, bookId) {
    // Delete loan by userId and bookId, including them in the description for clarity
    svc.delete("/loans/" + userId + "/" + bookId, {
        parameters: {
            description: "Delete a loan with bookId " + bookId + " and userId " + userId
        }
    });
}

/**
 * Verifies that a specific loan exists
 * @param {number} userId - The user ID associated with the loan
 * @param {number} bookId - The book ID associated with the loan
 */
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

/**
 * Verifies that a specific loan does not exist
 * @param {number} userId - The user ID associated with the loan
 * @param {number} bookId - The book ID associated with the loan
 */
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

/**
 * Attempts to add a loan that already exists (should fail)
 * @param {number} userId - The ID of the user
 * @param {number} bookId - The ID of the book
 */
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

/**
 * Event Matching and Waiting Operations
 * These functions handle event detection and synchronization
 */

/**
 * Matches an event based on its description
 * @param {string} description - The exact description to match
 * @returns {EventSet} An event set that matches the description
 */
function matchesDescription(description) {
    return bp.EventSet("test", function (e) {
        if (!e.data) return false;
        if (!e.data.parameters) return false;
        if (!e.data.parameters.description) return false;
        return e.data.parameters.description === description;
    });
}

/**
 * Matches any "Add Book" event
 * @returns {EventSet} An event set that matches any "Add Book" event
 */
function matchAnyAddBook() {
    return bp.EventSet("test", function (e) {
        if (!e.data) return false;
        if (!e.data.parameters) return false;
        if (!e.data.parameters.description) return false;


        return e.data.parameters.description.startsWith("Add a book with id");
    });
}

/**
 * Matches any "Add User" event
 * @returns {EventSet} An event set that matches any "Add User" event
 */
function matchAnyAddUser() {
    return bp.EventSet("test", function (e) {
        if (!e.data) return false;
        if (!e.data.parameters) return false;
        if (!e.data.parameters.description) return false;

        return e.data.parameters.description.startsWith("Add a user with id");
    });
}

/**
 * Matches any "Add Loan" event
 * @returns {EventSet} An event set that matches any "Add Loan" event
 */
function matchAnyAddLoan() {
    return bp.EventSet("test", function (e) {
        if (!e.data) return false;
        if (!e.data.parameters) return false;
        if (!e.data.parameters.description) return false;

        return e.data.parameters.description.startsWith("Add a loan with userId");
    });
}

/**
 * Matches any "Delete Book" event
 * @returns {EventSet} An event set that matches any "Delete Book" event    
 */
function matchAnyDeleteBook() {
    return bp.EventSet("test", function (e) {
        if (!e.data) return false;
        if (!e.data.parameters) return false;
        if (!e.data.parameters.description) return false;

        return e.data.parameters.description.startsWith("Delete a book with id");
    });
}

/**
 * Matches any "Delete User" event
 * @returns {EventSet} An event set that matches any "Delete User" event
 */
function matchAnyDeleteUser() {
    return bp.EventSet("test", function (e) {
        if (!e.data) return false;
        if (!e.data.parameters) return false;
        if (!e.data.parameters.description) return false;

        return e.data.parameters.description.startsWith("Delete a user with id");
    });
}

/**
 * Matches any "Delete Loan" event
 * @returns {EventSet} An event set that matches any "Delete Loan" event
 */
function matchAnyDeleteLoan() {
    return bp.EventSet("test", function (e) {
        if (!e.data) return false;
        if (!e.data.parameters) return false;
        if (!e.data.parameters.description) return false;

        return e.data.parameters.description.startsWith("Delete a loan with userId");
    });
}

/**
 * Event Waiting Functions for Books
 */

/**
 * Waits for any book to be added and returns its details
 * @returns {Object} Object containing the id and title of the added book
 */
function waitForAnyBookAdded() {
    let e = waitFor(matchAnyAddBook());
    let id = e.data.parameters.description.match(/id (\d+)/)[1]; // Extract the book id from the description
    let title = e.data.parameters.description.match(/title (.+)$/)[1]; // Extract the book title from the description
    return { id: +id, title: title };
};


/**
 * Waits for a specific book to be deleted
 * @param {number} id - The ID of the book to wait for
 * @param {string} title - The title of the book to wait for
 */
function waitForBookDeleted(id, title) {
    waitFor(matchesDescription("Delete a book with id " + id + " and title " + title));
}

/**
 * Event Waiting Functions for Users
 */

/**
 * Waits for any user to be added and returns its details
 * @returns {Object} Object containing the id and name of the added user
 */
function waitForAnyUserAdded() {
    let e = waitFor(matchAnyAddUser());
    let id = e.data.parameters.description.match(/id (\d+)/)[1]; // Extract the user id from the description
    let name = e.data.parameters.description.match(/name (.+)$/)[1]; // Extract the user name from the description
    return { id: +id, name: name };
}

/**
 * Waits for a specific user to be added
 * @param {number} id - The ID of the user to wait for
 * @param {string} name - The name of the user to wait for
 */
function waitForUserAdded(id, name) {
    waitFor(matchesDescription("Add a user with id " + id + " and name " + name));
}

/**
 * Waits for a specific user to be deleted
 * @param {number} id - The ID of the user to wait for
 * @param {string} name - The name of the user to wait for
 */
function waitForUserDeleted(id, name) {
    waitFor(matchesDescription("Delete a user with id " + id + " and name " + name));
}

/**
 * Event Waiting Functions for Loans
 */


/**
 * Waits for any loan to be added and returns its details
 * @returns {Object} Object containing the userId and bookId of the added loan
 */
function waitForAnyLoanAdded() {
    let e = waitFor(matchAnyAddLoan());
    let userId = e.data.parameters.description.match(/userId (\d+)/)[1]; // Extract the user id from the description
    let bookId = e.data.parameters.description.match(/bookId (\d+)/)[1]; // Extract the book id from the description
    return { userId: +userId, bookId: +bookId };
}


/**
 * Waits for a specific loan to be added
 * @param {number} userId - The ID of the user associated with the loan
 * @param {number} bookId - The ID of the book associated with the loan
 */
function waitForLoanAdded(userId, bookId) {
    waitFor(matchesDescription("Add a loan with userId " + userId + " and bookId " + bookId));
}

/**
 * Waits for a specific loan to be deleted
 * @param {number} userId - The ID of the user associated with the loan
 * @param {number} bookId - The ID of the book associated with the loan
 */
function waitForLoanDeleted(userId, bookId) {
    waitFor(matchesDescription("Delete a loan with userId " + userId + " and bookId " + bookId));
}

/**
 * Waits for any book to be deleted and returns its details
 * @returns {Object} Object containing the id and title of the deleted book
 */
function waitForAnyBookDeleted() {
    let e = waitFor(matchAnyDeleteBook());
    let id = e.data.parameters.description.match(/id (\d+)/)[1];
    let title = e.data.parameters.description.match(/title (.+)$/)[1];
    return { id: +id, title: title };
}

/**
 * Waits for any user to be deleted and returns its details
 * @returns {Object} Object containing the id and name of the deleted user
 */
function waitForAnyUserDeleted() {
    let e = waitFor(matchAnyDeleteUser());
    let id = e.data.parameters.description.match(/id (\d+)/)[1];
    let name = e.data.parameters.description.match(/name (.+)$/)[1];
    return { id: +id, name: name };
}

/**
 * Waits for any loan to be deleted and returns its details
 * @returns {Object} Object containing the userId and bookId of the deleted loan
 */
function waitForAnyLoanDeleted() {
    let e = waitFor(matchAnyDeleteLoan());
    let userId = e.data.parameters.description.match(/userId (\d+)/)[1];
    let bookId = e.data.parameters.description.match(/bookId (\d+)/)[1];
    return { userId: +userId, bookId: +bookId };
}
