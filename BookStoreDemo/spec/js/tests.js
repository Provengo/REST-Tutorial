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
      addUser(111, "John Doe");
      addBook(222, "The Great Gatsby");
      deleteBook(222, "The Great Gatsby");
      // addLoan(111, 222);
      // tryToAddExistingLoan(111, 222);
      // verifyLoanExists(111, 222);
    });

    // bthread("User API", function () {
    //   waitFor(Any({ parameters: { description: "Add a user with id 111 and name John Doe" } }));
    //   verifyUserExists(111, "John Doe");
    // });

    bthread("Book verification", function () {
      waitForBookAdded(222, "The Great Gatsby");
      block(matchesDescription("Delete a book with id 222 and title The Great Gatsby"), function () {
        verifyBookExists(222, "The Great Gatsby");
      });
    });

}
/////////////////  End of Test Cases  ///////////////////////