const QUERY = {
  GET_ACCOUNT: "SELECT * from user WHERE email = ?",
  GET_NAME: "SELECT name from user WHERE name = ?",
  GET_EMAIL: "SELECT email from user WHERE email = ?",
  GET_PASSWORD: "SELECT password from user WHERE email = ?",
  INSERT_ACCOUNT: "INSERT INTO user (name, email, password) VALUES (?,?,?)",
  DELETE_ACCOUNT: "DELETE from user WHERE name = ?",
  UPDATE_PASSWORD: "UPDATE user SET password = ? WHERE name = ?",
  INSERT_HISTORY: "INSERT INTO history (email) VALUES (?)", //add email
  ADD_SEARCH: "UPDATE history SET search = CASE WHEN search IS NULL THEN ? ELSE search END WHERE email = ?", //add search
  ADD_SEARCHCOUNT: "UPDATE history SET searchCount = (ISNULL(searchCount, 0)+1) WHERE search = ? AND email = ?", //increment
  CREATE_USER_TABLE:
    "CREATE TABLE IF NOT EXISTS user (email text PRIMARY KEY UNIQUE NOT NULL, password text NOT NULL, name text NOT NULL, CONSTRAINT email_unique UNIQUE (email))",
  CREATE_HISTORY_TABLE: //column for each city and num count for how many
    "CREATE TABLE IF NOT EXISTS history (email text PRIMARY KEY NOT NULL, search text, searchCount integer, FOREIGN KEY (email) REFERENCES user (email))"
  };

module.exports = QUERY;
