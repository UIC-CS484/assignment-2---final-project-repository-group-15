const QUERY = {
  GET_ACCOUNT: "SELECT * from user WHERE email = ?",
  GET_NAME: "SELECT name from user WHERE name = ?",
  GET_EMAIL: "SELECT email from user WHERE email = ?",
  GET_PASSWORD: "SELECT password from user WHERE email = ?",
  INSERT_ACCOUNT: "INSERT INTO user (name, email, password) VALUES (?,?,?)",
  DELETE_ACCOUNT: "DELETE from user WHERE name = ?",
  UPDATE_PASSWORD: "UPDATE user SET password = ? WHERE name = ?",
  INSERT_HISTORY: "", //add email
  INSERT_SEARCH: "", //add search
  CREATE_USER_TABLE:
    "CREATE TABLE IF NOT EXISTS user (email text PRIMARY KEY UNIQUE NOT NULL, password text NOT NULL, name text NOT NULL, CONSTRAINT email_unique UNIQUE (email))",
  CREATE_USER_HISTORY: //column for each city and num count for how many
    "CREATE TABLE IF NOT EXISTS history (email text PRIMARY KEY NOT NULL, search text, searchCount integer, FOREIGN KEY (email) REFERENCES user (email))"
  };

module.exports = QUERY;
