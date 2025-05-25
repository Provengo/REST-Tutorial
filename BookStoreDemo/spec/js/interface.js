const svc = new RESTSession("http://" + host + ":" + port, "provengo basedclient", {
    headers: { "Content-Type": "application/json" }
});





// Add a book to the store
function addBook(id, title) {
    svc.post("/books", { 
        body: JSON.stringify({ 
            id: id, 
            title: title, 
        }), 
    });
    bp.log.info(">> Add book with id " + id + " and title " + title);
}

// Add a user to the store
function addUser(id, name) {
    svc.post("/users", { 
        body: JSON.stringify({ 
            id: id, 
            name: name, 
        }), 
    });
    bp.log.info(">> Add user with id " + id + " and name " + name);
}

// Try to add a book that already exists
function tryToAddExistingBook(id, title) {
    svc.post("/books", {
        body: JSON.stringify({ id: id, title: title }),
        expectedResponseCodes: [400]
    });
    bp.log.info(">> Try to add existing book with id " + id + " and title " + title);
}

// Try to add a user that already exists
function tryToAddExistingUser(id, name) {
    svc.post("/users", {
        body: JSON.stringify({ id: id, name: name }),
        expectedResponseCodes: [400]
    });
    bp.log.info(">> Try to add existing user with id " + id + " and name " + name);
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
        }
    });
    bp.log.info(">> Verify user with "+ id + " and name " + name + " exists");
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
        }
    });
    bp.log.info(">> Verify user with "+ id + " and " + name + " does not exist");
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
        }
    });
    bp.log.info(">> Verify book with "+ id + " and " + title + " exists");
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
        }
    });
    bp.log.info(">> Verify book with "+ id + " and " + title + " does not exist");
}


// Helper functions for Loan API endpoints
function addLoan(id, userId) {
    svc.post("/loans", { body: JSON.stringify({ bookId: id, userId: userId }) });
    bp.log.info(">> Add loan with bookId " + id + " and userId " + userId);

}

function deleteLoan(id) {
    svc.delete("/loans/" + id);
    bp.log.info(">> Delete loan with id " + id);
}

function checkLoanExists(id) {
    svc.get("/loans?q=" + id, function(response) {
        const results = JSON.parse(response.body);
        if (results.some(loan => loan.id === id)) {
            pvg.success("Loan " + id + " exists");
        } else {
            pvg.fail("Loan " + id + " not found");
        }
    });
    bp.log.info(">> Check that loan with id " + id + " exists");
}

function checkLoanDoesNotExist(id) {
    svc.get("/loans?q=" + id, function(response) {
        const results = JSON.parse(response.body);
        if (results.some(loan => loan.id === id)) {
            pvg.fail("Loan " + id + " should not exist but it does");
        } else {
            pvg.success("Loan " + id + " does not exist");
        }
    });
    bp.log.info(">> Check that loan with id " + id + " does not exist");
}
