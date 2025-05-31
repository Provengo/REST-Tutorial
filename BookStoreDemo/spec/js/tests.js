//@provengo summon rest


/////////////////////////////////////////////////////////
// A simple linear script
// bthread("User API", function () {
//   addUser(111, "John Doe");
//   tryToAddExistingUser(111, "John Doe");
//   verifyUserExists(111, "John Doe");
//   verifyUserDoesNotExist(222, "Jane Doe");
//   addUser(222, "John Doe");
//   verifyUserExists(222, "John Doe");
// }); 
///////////////////////////////////////////////////////


//////////////////////////////////////////////////////
// Two interleved independent linear scripts
// bthread("User API", function () {
//   addUser(111, "John Doe");
//   tryToAddExistingUser(111, "John Doe");
//   verifyUserExists(111, "John Doe");
// });

// bthread("Book API", function () {
//   addBook(111, "The Great Gatsby");
//   tryToAddExistingBook(111, "The Great Gatsby");
//   verifyBookExists(111, "The Great Gatsby");
// });
//////////////////////////////////////////////////////



//////////////////////////////////////////////////////
// Loan API script
bthread("Loan API", function () {
  addUser(111, "John Doe");
  addBook(222, "The Great Gatsby");
  addLoan(111, 222);
  tryToAddExistingLoan(111, 222);
  verifyLoanExists(111, 222);
  verifyUserExists(111, "John Doe");
  verifyBookExists(222, "The Great Gatsby");
});

//////////////////////////////////////////////////////