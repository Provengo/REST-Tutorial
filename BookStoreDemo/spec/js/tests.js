//@provengo summon rest


// "LINEAR" or "PARALLEL"
with (Main.options.getOptional('mode', Packages.java.lang.String)) {
  const mode = isPresent() ? get() : "LINEAR"; // Default to LINEAR if not specified
}

bp.log.info("Starting BookStoreDemo test with mode: " + mode);


//////////////////////////////////////////////////////
switch (mode) {

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
    break;

  case "PARALLEL":

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
      ttryToDeleteABookInLoan(book.id, book.title);
      tryToAddExistingLoan(100, book.id);
      tryToDeleteAUserInLoan(100, "John Doe");
      deleteLoan(100, book.id);
      verifyLoanDoesNotExist(100, book.id);
      deleteUser(100, "John Doe");
    });

    bthread("Jane's Loan", function () {
      addUser(101, "Jane Smith");
      let book = waitForAnyBookAdded();
      addLoan(101, book.id);
      tryToDeleteABookInLoan(book.id, book.title);
      tryToAddExistingLoan(101, book.id);
      tryToDeleteAUserInLoan(101, "Jane Smith");
      deleteLoan(101, book.id);
      deleteUser(101, "Jane Smith");
    });

    /**
     * User Addition Monitor
     * Listens for any user addition event and verifies the user exists in the system.
     * Blocks deletion attempts until verification is complete to ensure atomic operations.
     */
    bthread("User add verification", function () {
      user = waitForAnyUserAdded();
      block(matchDeleteUser(user.id, user.name), function () {
        verifyUserExists(user.id, user.name);
      });
    });


    /**
     * Book Addition Monitor
     * Tracks book additions and ensures each new book is properly registered.
     * Prevents deletion operations until the book's existence is confirmed.
     */
    bthread("Book add verification", function () {
      book = waitForAnyBookAdded();

      block(matchDeleteBook(book.id, book.title), function () {
        verifyBookExists(book.id, book.title);
      });
    });

    /**
     * Loan Creation Monitor
     * Validates that each new loan is properly recorded in the system.
     * Blocks deletion attempts until the loan is verified to exist.
     */
    bthread("Loan add verification", function () {
      loan = waitForAnyLoanAdded();

      block(matchDeleteLoan(loan.userId, loan.bookId), function () {
        verifyLoanExists(loan.userId, loan.bookId);
      });
    });

    /**
     * User Deletion Monitor
     * Ensures users are properly removed from the system.
     * Blocks new user creation with same ID until deletion is verified.
     */
    bthread("User deletion verification", function () {
      user = waitForAnyUserDeleted();

      block(matchAddUser(user.id, user.name), function () {
        verifyUserDoesNotExist(user.id, user.name);
      });
    });

    // Book deletion verification
    bthread("Book deletion verification", function () {
      book = waitForAnyBookDeleted();

      block(matchAddBook(book.id, book.title), function () {
        verifyBookDoesNotExist(book.id, book.title);
      });
    });

    // Loan deletion verification
    bthread("Loan deletion verification", function () {
      loan = waitForAnyLoanDeleted();

      block(matchAddLoan(loan.userId, loan.bookId), function () {
        verifyLoanDoesNotExist(loan.userId, loan.bookId);
      });
    });
}
/////////////////  End of Test Cases  ///////////////////////