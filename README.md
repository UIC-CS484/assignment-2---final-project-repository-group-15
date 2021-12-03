# Transport Suggestor

## Team 15 Fall-2021

## Objective
-  Our website is available at https://transport-suggester.herokuapp.com/
- Our website aims at providing users who wish to travel with accurate weather data, arrival and drop off times at various blue line CTA subway stations and list of recent public advisories in Chicago which helps the user to make an informed desicion whether to take a particular route or not.

## Team member role's and bio
* Frontend(UI),Backend,Database- Asif Iqbal Gazi

* API Calling, Frontend(UI),Testing-Sai Nirmal Morampudi

* Testing,Database-Zainab Mohammad


## API Calling and Snippets
- We are making calls to few API to get data regarding, weather and arrival time of various CTA blue line trains. We are getting the the weather data from OpenWeatherMap API.
- The user will input the station he/she is at and the station the user wants to visit and will hit the submit button. Then will display the arrival and drop off times for that route. The user can also find weather description,temperature  of a particualr city.
- example use cases can be source: UIC-Halsted, destination:LaSalle or source: Washington, destination:Grand and so on.
- We are also displaying most recenlty reported Crime Data
- Below are code snippets  for the weather, Public advisory and CTA API calls
-       const wAPIKey = process.env.WEATHER_API_KEY;
      console.log(wAPIKey);
      const measureUnits = "metric";
      const url =
        "https://api.openweathermap.org/data/2.5/weather?" +
        "q=" +
        query1 +
        "&appid=" +
        wAPIKey +
        "&units=" +
        measureUnits;
      let temp = "";
      let weatherDescripton = " ";
      let imageUrl = " ";
      let icon = " ";
      let weatherData = " ";
      let stationName = req.body.travelSource;
      if(stationName == null || stationName==="")
        return res.redirect('dashboard');
   Crime API code
-         urlCrimes="https://data.cityofchicago.org/resource/ijzp-q8t2.json?$limit=12";<br>
                                  https.get(urlCrimes,function(response){<br>
                                    response.on("data",function(data){<br>
                                        const crimeData= JSON.parse(data);<br>
                                        for (let i=0;i<=11;i++){<br>
                                          let obj = {};<br>
                                          obj.date = crimeData[i].date;<br>
                                          obj.primary_type=crimeData[i].primary_type;<br>
                                          obj.description=crimeData[i].description;<br>
                                          obj.block=crimeData[i].block;<br>
                                          crimeDataa.push(obj);<br>
                                        }<br>
- Entire CTA API code is not being displayed over here as its quite big

         if (blueLine.indexOf(stationName) > blueLine.indexOf(destinationName)) {
          //res.write("");
          trDr = 5;
        } else {
          trDr = 1;
          //res.write("");
        }

        urlSource =
          "https://data.cityofchicago.org/resource/8pix-ypme.json?" +
          "station_name=" +
          stationName;
        https.get(urlSource, function (response) {
          response.on("data", function (data) {
            trainDataSource = JSON.parse(data);

            //code to get mapid for blue=ture
            mapIdentiferSource = "";
            for (let index in trainDataSource) {
              if (trainDataSource[index].blue) {
                mapIdentiferSource = trainDataSource[index].map_id;
                //res.write(trainData[index].map_id);
                break;
              }
            }
            mapIdSource = mapIdentiferSource; //Identifying Mapid

            // getting destination map id
            urlDestination =
              "https://data.cityofchicago.org/resource/8pix-ypme.json?" +
              "station_name=" +
              destinationName;
            https.get(urlDestination, function (response) {
              response.on("data", function (data) {
                trainDataDestination = JSON.parse(data);
                //code to get mapid for blue=ture
                mapIdentiferDestination = "";
                for (let index in trainDataDestination) {
                  if (trainDataDestination[index].blue) {
                    mapIdentiferDestination = trainDataDestination[index].map_id;
                    //res.write(trainData[index].map_id);
                    break;
                  }
                }
                mapIdDestination = mapIdentiferDestination; //ends here
                //console.log(mapIdDestination);

## Running the project 
- URL link to the website https://transport-suggester.herokuapp.com/

   Requirements for running the app locally
* node.js
* npm
- Download the application as Zip Folder or clone the repository
- goto app.js file, to install the dependencies use 
```
 npm install
 
```
- then to start the server issue the following command
```
npm run dev
```
- once the server is running go to http://localhost:3000/

## CRUD Functionalities

- CRUD functionalities like modifying password and deleting user account have been implemented.

## Tools and Resources

### Tools
- VScode for code creation and editing
- Git
- Postman

### Resources
- Docker
- sqlite3
- passport.js
- Express.js
- Ejs
- node.js
 

## ERD Diagram

<img width="393" alt="database" src="https://user-images.githubusercontent.com/40325698/142331723-dee419e4-00e2-4725-8629-ddfc27af19b0.PNG">
- Bolded attributes are NOT-NULL, non-bolded attributes may be NULL.


## Charts

- In charting we are trying to display minimum and maximum temperature of Chicago for next Seven from current date as this is also factor that is considered while travelling to someplace.

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
