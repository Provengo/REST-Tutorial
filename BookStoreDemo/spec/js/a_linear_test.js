//@provengo summon rest

// Parse this file only if the mode is "LINEAR"
if(mode === "LINEAR") {

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

} // End of "LINEAR" mode