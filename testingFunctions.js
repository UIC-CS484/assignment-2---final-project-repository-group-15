module.exports.passwordCheck = function (password) {
  if (password.length < 6) {
    return true;
  }
  return false;
};
module.exports.passwordMatch = function (password1, password2) {
  if (password1 != password2) {
    return true;
  }
  return false;
};
module.exports.domainCheck = function (email) {
  if (/\.([a-zA-Z]{3})\/?$/i.test(email)) {
    return true;
  }
  return false;
};
module.exports.atCheck = function (email) {
  if (email.includes("@")) {
    return true;
  }
  return false;
};
