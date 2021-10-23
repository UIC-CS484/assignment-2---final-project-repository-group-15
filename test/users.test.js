//const supertest = require("supertest");
const testingFunctions = require("../testingFunctions");

const inputPasswordFalse = "password_999";
const inputPasswordTrue = "passw";

test("password characters more than 6 characters", () => {
  var isPasswordOkay = testingFunctions.passwordCheck(inputPasswordFalse);
  expect(isPasswordOkay).toBe(false);
});
test("password characters less than 6 characters", () => {
  var isPasswordOkay = testingFunctions.passwordCheck(inputPasswordTrue);
  expect(isPasswordOkay).toBe(true);
});

const inputPassword1 = "1234567";
const inputPassword2 = "1243675";

test("passwords not matching during registration", () => {
  var arePasswordMatching = testingFunctions.passwordMatch(
    inputPassword1,
    inputPassword2
  );
  expect(arePasswordMatching).toBe(true);
});

const inputPasword1 = "1234567";
const inputPasword2 = "1234567";

test("passwords  matching during registration", () => {
  var arePasswordMatching = testingFunctions.passwordMatch(
    inputPasword1,
    inputPasword2
  );
  expect(arePasswordMatching).toBe(false);
});

const inputEmailNoAt = "johngmail.com";
const inputEmailAt = "john@gmail.com";

test("email has an @", () => {
  var doesContainAt = testingFunctions.atCheck(inputEmailAt);
  expect(doesContainAt).toBe(true);
});

test("email does not have an @", () => {
  var doesContainAt = testingFunctions.atCheck(inputEmailNoAt);
  expect(doesContainAt).toBe(false);
});

const inputEmailBadDomain = "john@gmailcom";
const inputEmailGoodDomain = "john@gmail.com";

test("email has .com or other valid domain ending", () => {
  var doesHaveEnding = testingFunctions.domainCheck(inputEmailGoodDomain);
  expect(doesHaveEnding).toBe(true);
});

test("email does not have valid domain ending", () => {
  var doesHaveEnding = testingFunctions.domainCheck(inputEmailBadDomain);
  expect(doesHaveEnding).toBe(false);
});
