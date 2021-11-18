# Transport Suggestion

## Running the project
- Download the application as Zip Folder or clone the repository
- goto app.js file, to install the dependencies use 
```
 npm install
 
```
- then to start the server issue the following command
```
npm start
```
- once the server is running go to http://localhost:3000/



## Testing
Unit tests will be written for most forms of user input. Whenever functionality that could change the state of the website or database is added, at least 1 appropriate pair of tests will be added to check validity. The current unit tests check password and email validity. These guarantee the user is correctly registering and logging in. They are tested in pairs, with one checking a correct input and should return true if the test passes, and the other checking incorrect values, which should return false if the test passes.
 - for testing use the command 
 ```
npm start
```
 - The first two tests check password length, and make sure it is at least 6 characters long.
 - The next two test password matching during registration.
 - The next two check for an @ character in an email.
 - Finally, the last two ensure that the email has a valid ending, such as ".com".
 
In future iterations, additional tests may test inputs in various ways against a database of user information. Tests may also check if the implentation of APIs is being performed correctly.

## Team Members

### Asif Iqbal Gazi

- [agazi3@uic.edu](agazi3@uic.edu)
- [https://github.com/Asif-Iqbal-Gazi](https://github.com/Asif-Iqbal-Gazi)

### Zainab Mohammad

- [zmoham22@uic.edu](zmoham22@uic.edu)
- [https://github.com/ZainabMo](https://github.com/ZainabMo)

### Sai Nirmal Morampudi

- [smoram2@uic.edu](smoram2@uic.edu)
- [https://github.com/SaiNirmalMorampudi](https://github.com/SaiNirmalMorampudi)
