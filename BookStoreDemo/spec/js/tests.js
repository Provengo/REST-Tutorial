//@provengo summon rest


bthread("User API", function () {
  addUser(111, "John Doe");
  tryToAddExistingUser(111, "John Doe");
  verifyUserExists(111, "John Doe");
  verifyUserDoesNotExist(222, "Jane Doe");
  addUser(222, "John Doe");
  verifyUserExists(222, "John Doe");
});