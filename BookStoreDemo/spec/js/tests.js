//@provengo summon rest


// "LINEAR" or "PARALLEL"
const stage = "PARALLEL"




//////////////////////////////////////////////////////
switch (stage) {

  case "LINEAR":
    // A simple linear story for a library loan system
    bthread("Loan API", function () {
      addUser(111, "John Doe");
      addBook(222, "The Great Gatsby");
      addLoan(111, 222);
      tryToAddExistingLoan(111, 222);
      verifyLoanExists(111, 222);
      verifyUserExists(111, "John Doe");
      verifyBookExists(222, "The Great Gatsby");
    });

  case "PARALLEL":
    // A parallel story for a library loan system
    bthread("Loan API", function () {
      addUser(100, "John Doe");
      addUser(101, "Jane Smith");
      addBook(200, "The Great Gatsby");
      addLoan(100, 200);
      tryToDeleteNonExistentBookOrInLoan(200, "The Great Gatsby");
      tryToAddExistingLoan(100, 200);
      tryToDeleteNonExistentUserOrInLoan(100, "John Doe");

    });

    // Verify the user exists after being added
    bthread("User add verification", function () {
      user = waitForAnyUserAdded();

      block(matchesDescription("Delete a user with id " + user.id + " and name " + user.name), function () {
        verifyUserExists(user.id, user.name);
      });
    });


    // Verify the book exists after being added
    bthread("Book add verification", function () {
      book = waitForAnyBookAdded();

      block(matchesDescription("Delete a book with id " + book.id + " and title " + book.title), function () {
        verifyBookExists(book.id, book.title);
      });
    });

    // Verify the loan exists after being added
    bthread("Loan add verification", function () {
      loan = waitForAnyLoanAdded();

      block(matchesDescription("Delete a loan with user id " + loan.userId + " and book id " + loan.bookId), function () {
        verifyLoanExists(loan.userId, loan.bookId);
      });
    });

    // User deletion verification
    bthread("User deletion verification", function () {
      user = waitForAnyUserDeleted();

      block(matchesDescription("Add user with id " + user.id + " and name " + user.name), function () {
        verifyUserDoesNotExist(user.id, user.name);
      });
    });

    // Book deletion verification
    bthread("Book deletion verification", function () {
      book = waitForAnyBookDeleted();

      block(matchesDescription("Verify book with id " + book.id + " and title " + book.title), function () {
        verifyBookDoesNotExist(book.id, book.title);
      });
    });

    // Loan deletion verification
    bthread("Loan deletion verification", function () {
      loan = waitForAnyLoanDeleted();

      block(matchesDescription("Verify loan with user id " + loan.userId + " and book id " + loan.bookId), function () {
        verifyLoanDoesNotExist(loan.userId, loan.bookId);
      });
    });
}
/////////////////  End of Test Cases  ///////////////////////