"use strict";
const bcrypt = require("bcrypt");
const query = require("../config/query");
const db = require("../config/sqlite3").db;
const https = require("https");
const passwordValidator = require("password-validator");
require("dotenv").config();
let crimeDataa = [];

// Password validator
function isValidPassword(password) {
  var schema = new passwordValidator();
  schema
    .is()
    .min(6) // Minimum length 6
    .is()
    .max(30) // Maximum length 30
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits(1) // Must have at least 1 digits
    .has()
    .not()
    .spaces() // Should not have spaces
    .is()
    .not()
    .oneOf([
      "password",
      "123456",
      "abcdef",
      "qwerty",
      "abc123",
      "qwerty123",
      "12345678",
      "1234567890",
      "password123",
      "123456789",
    ]); // Blacklist these values
  if (!schema.validate(password)) {
    return false;
  }
  return true;
}

// Render the welcome page
module.exports.welcome = (req, res) => {
  return res.render("welcome.ejs");
};

// Writing chart
module.exports.chart = (req, res) => {
  // console.log("chart called");
  return res.render("chart");
};

// Render the register page
module.exports.register = (req, res) => {
  if (req.isAuthenticated()) {
    //error.push("Already logged in");
    return res.redirect("dashboard");
  }
  return res.render("register");
};

// Render the login page
module.exports.login = (req, res) => {
  if (req.isAuthenticated()) {
    //error.push("Already logged in");
    return res.redirect("dashboard");
  }
  return res.render("login");
};

// Render the dashboard page
module.exports.dashboard = (req, res) => {
  if (req.isAuthenticated()) {
    return res.render("dashboard", {
      name: req.user.name,
    });
  }
  req.flash("error_msg", "Please login to view this resource");
  return res.redirect("login");
};

// Render the 404 page
module.exports.notFound = (req, res) => {
  if (req.isAuthenticated()) {
    return res.render("dashboard", {
      name: req.user.name,
    });
  }
  return res.render("welcome.ejs");
};

// Register Handle
module.exports.createUser = (req, res) => {
  // Pulling some variables from req.body
  const { name, email, password, password2 } = req.body;
  // For validation let us first create an array
  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  // Check passwords match
  if (password != password2) {
    errors.push({ msg: "Password do not match" });
  }

  // Check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  // Password requirement check
  if (!isValidPassword(password)) {
    errors.push({
      msg: "Password should contain alphanumeric and special charaters!",
    });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // Validation passed
    // Hash Password

    bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
          throw err;
        } else {
          // Set password to hashed password
          const params = [req.body.name, req.body.email, hash];
          console.log(hash);
          // Save user in db
          db.run(query.INSERT_ACCOUNT, params, (dbErr, row) => {
            // User exists
            if (dbErr) {
              errors.push({ msg: "Email is already regsitered" });
              res.render("register", {
                errors,
                name,
                email,
                password,
                password2,
              });
            } else {
              db.run(query.INSERT_HISTORY, req.body.email, (dbErr, row) => {
                if (dbErr) {
                  errors.push({ msg: "couldn't insert into history" });
                }
              });
              // User was not system hence, created it.
              // We want to redirect to login
              // But before we want to display the messages using flash
              req.flash("success_msg", "You are now registered and can login");
              res.redirect("/users/login");
            }
          });
        }
      })
    );
    //console.log(params);
    // res.send('pass')
  }
  //console.log(req.body)
};

// Login Handle
module.exports.createSession = (req, res, next) => {
  if (req.isAuthenticated()) {
    {
      req.flash("success", "Logged In");
      console.log("I am IN");
      return res.redirect("/users/dashboard");
    }
    res.redirect("/users/login");
  }
};

// Logout handle
module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
};

module.exports.deleteUser = (req, res) => {
  console.log("Inside controller");
  var name = req.user.name;
  req.logout();
  //console.log(`User: ${req.user.name}`);
  db.run(query.DELETE_ACCOUNT, name, (dbErr, row) => {
    if (dbErr) {
      errors.push({ msg: "User does not exists!" });
      res.redirect("/");
    } else {
      // User was not system hence, created it.
      // We want to redirect to login
      // But before we want to display the messages using flash
      console.log("Inside else now");
      //req.flash("success_msg", "Account successfully deleted!");
      res.redirect("/");
    }
  });
};

// Update password handle
module.exports.changePassword = (req, res) => {
  console.log("Inside change_pass controller");
  var newPass = req.body.newPassword;
  var name = req.user.name;
  // For validation let us first create an error array
  let errors = [];

  // Check if new password is empty
  if (!newPass) {
    errors.push({ msg: "Please fill the new password" });
  }

  // Check passsword length
  if (newPass.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  // Password requirement checks
  // Password requirement check
  if (!isValidPassword(password)) {
    errors.push({
      msg: "Password should contain alphanumeric and special charaters!",
    });
  }

  if (errors.length > 0) {
    console.log("Implement Password Change error handling");
    res.render("login");
  } else {
    // Validation Passed
    // Hash Password
    bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(newPass, salt, (err, hash) => {
        if (err) {
          throw err;
        } else {
          console.log(hash);
          db.run(query.UPDATE_PASSWORD, hash, name, (dbErr, row) => {
            // Db Error Check
            if (dbErr) {
              errors.push({ msg: "Db Error During Password Update" });
              res.render("login");
            } else {
              console.log("Password Updated Successfully");
              res.redirect("/dashboard");
            }
          });
        }
      })
    );
  }
};

//weather API

module.exports.submit = function (req, res) {
  let errors = [];
  try {
    if (req.isAuthenticated()) {
      const query1 = req.body.cityName;
      // if (err){
      //   console.log("empty field");
      //   return res.redirect('dashboard');
      // }

      //add search to DB
      db.run(query.ADD_SEARCH, query1, req.body.email, (dbErr, row) => {
        if (dbErr) {
          errors.push({ msg: "couldn't add search" });
        }
      });
      db.run(query.ADD_SEARCHCOUNT, query1, req.body.email, (dbErr, row) => {
        if (dbErr) {
          errors.push({ msg: "couldn't increment search count" });
        }
      });

      const wAPIKey = process.env.WEATHER_API_KEY;
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
      if (stationName == null || stationName === "")
        return res.redirect("dashboard");

      db.run(query.ADD_SEARCH, stationName, req.body.email, (dbErr, row) => {
        if (dbErr) {
          errors.push({ msg: "couldn't add search" });
        }
      });
      db.run(
        query.ADD_SEARCHCOUNT,
        stationName,
        req.body.email,
        (dbErr, row) => {
          if (dbErr) {
            errors.push({ msg: "couldn't increment search count" });
          }
        }
      );

      let destinationName = req.body.travelDestination;
      if (destinationName == null || destinationName === "")
        return res.redirect("dashboard");

      db.run(
        query.ADD_SEARCH,
        destinationName,
        req.body.email,
        (dbErr, row) => {
          if (dbErr) {
            errors.push({ msg: "couldn't add search" });
          }
        }
      );
      db.run(
        query.ADD_SEARCHCOUNT,
        destinationName,
        req.body.email,
        (dbErr, row) => {
          if (dbErr) {
            errors.push({ msg: "couldn't increment search count" });
          }
        }
      );

      let trDr = 0;
      let urlSource = "";
      let trainDataSource = " ";
      let mapIdentiferSource = " ";
      let mapIdSource = " ";
      let urlDestination = " ";
      let trainDataDestination = " ";
      let mapIdentiferDestination = " ";
      let mapIdDestination = " ";
      let ctaAPIKey = " ";
      let url1Source = " ";
      let getRnsource = " ";
      let rnTrainSource = " ";
      let url2 = " ";
      let getSource = " ";
      let sourceStn = " ";
      let sourceArrival = " ";
      let url1Destination = " ";
      let getRndestination = " ";
      let routNumberdestination = " ";
      let rnTrainDestination = " ";
      let urlDesat = " ";
      let arrivalDestination = " ";
      let checkBoolean = " ";
      let sourceDestination = " ";
      let blueLine = " ";
      let urlCrimes = " ";

      https.get(url, function (response) {
        // console.log(response.statusCode);
        response.on("data", function (data) {
          weatherData = JSON.parse(data);
          if (weatherData == null || weatherData.main == null) {
            return res.redirect("dashboard");
          }
          temp = weatherData.main.temp;
          weatherDescripton = weatherData.weather[0].description;
          icon = weatherData.weather[0].icon;
          imageUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
          // res.write(" <h1>Temperature in " + query + " is: " + temp + " degree celsius</h1>");
          // res.write("<p>weather description : " + weatherDescripton + "</p>");
          // res.write("<img src=" + imageUrl + ">");
          //res.end();
          // res.render("apiData",{queryCity:query,queryTemperature:temp,weatherDescriptonTemperature:weatherDescripton,imageIcon:imageUrl})
        });
        //})

        //CTA API

        blueLine = [
          "Forest Park",
          "Harlem",
          "Oak Park",
          "Austin",
          "Central",
          "Cicero",
          "Kostner",
          "Pulaski",
          "Kedzie-Homan",
          "California",
          "Western",
          "Illinois Medical District",
          "Racine",
          "UIC-Halsted",
          "Clinton",
          "LaSalle",
          "Jackson",
          "Monroe",
          "Washington",
          "Clark/lake",
          "Grand",
          "Chicago",
          "Divison",
          "Damen",
          "Western",
          "California",
          "Logan Square",
          "Belmont",
          "Addison",
          "Irving Park",
          "Montrose",
          "Jefferson Park",
          "Harlem",
          "Cumberland",
          "Rosemont",
          "O'Hare",
        ];

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
                    mapIdentiferDestination =
                      trainDataDestination[index].map_id;
                    //res.write(trainData[index].map_id);
                    break;
                  }
                }
                mapIdDestination = mapIdentiferDestination; //ends here
                //console.log(mapIdDestination);
                ctaAPIKey = process.env.CTA_API_KEY;

                url1Source =
                  "https://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?" +
                  "key=" +
                  ctaAPIKey +
                  "&mapid=" +
                  mapIdSource +
                  "&rt=blue&outputType=JSON";
                https.get(url1Source, function (response) {
                  response.on("data", function (data) {
                    getRnsource = JSON.parse(data); //using mapId from trainData to get route number(rn)
                    var routNumber = " ";
                    for (let index in getRnsource.ctatt.eta) {
                      if (trDr == getRnsource.ctatt.eta[index].trDr) {
                        routNumber = getRnsource.ctatt.eta[index].rn;
                        break;
                      }
                    }
                    rnTrainSource = routNumber; //getting route number[0] as the earliest train's r is displayed first
                    url2 =
                      "https://lapi.transitchicago.com/api/1.0/ttfollow.aspx?" +
                      "key=" +
                      ctaAPIKey +
                      "&runnumber=" +
                      rnTrainSource +
                      "&outputType=JSON";
                    https.get(url2, function (response) {
                      response.on("data", function (data) {
                        getSource = JSON.parse(data);
                        sourceStn = getSource.ctatt.eta;
                        //sourceArrival=" ";
                        //console.log(sourceStn);
                        sourceArrival = "not available as of now";
                        for (let index in sourceStn) {
                          if (sourceStn[index].staNm === stationName) {
                            sourceArrival = sourceStn[index].arrT;
                            // res.write("<h1>The Arrival Time at Source " + stationName + " is " + sourceArrival + "</h1>");
                            // res.render("apiData",{sourestnArrival:stationName,sourceArrTime:sourceArrival});
                            break;
                          }
                        }

                        //dest map id processing and getting dest time
                        url1Destination =
                          "https://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?" +
                          "key=" +
                          ctaAPIKey +
                          "&mapid=" +
                          mapIdDestination +
                          "&rt=blue&outputType=JSON";

                        https.get(url1Destination, function (response) {
                          response.on("data", function (data) {
                            try {
                              getRndestination = JSON.parse(data); //using mapId from trainData to get route number(rn)
                            } catch (err) {
                              throw err;
                              // console.log("I am stuck");
                              // return ;
                            }
                            // if(getRndestination==null){
                            //   return res.redirect('dashboard');
                            // }
                            //var routNumberdestination = " ";
                            for (let index in getRndestination.ctatt.eta) {
                              if (
                                rnTrainSource == getRnsource.ctatt.eta[index].rn
                              ) {
                                routNumberdestination =
                                  getRnsource.ctatt.eta[index].rn;
                                break;
                              }
                            }
                            rnTrainDestination = routNumberdestination; //getting route number[0] as the earliest train's r is displayed first
                            console.log(
                              " The train RN are looking for " +
                                rnTrainDestination
                            );
                            //get destination arrival time
                            urlDesat =
                              "https://lapi.transitchicago.com/api/1.0/ttfollow.aspx?" +
                              "key=" +
                              ctaAPIKey +
                              "&runnumber=" +
                              rnTrainDestination +
                              "&outputType=JSON";
                            https.get(urlDesat, function (response) {
                              response.on("data", function (data) {
                                arrivalDestination = JSON.parse(data);
                                checkBoolean = false;
                                sourceDestination = "not available as of now";
                                for (let index in arrivalDestination.ctatt
                                  .eta) {
                                  if (
                                    arrivalDestination.ctatt.eta[index]
                                      .staNm === destinationName
                                  ) {
                                    sourceDestination =
                                      arrivalDestination.ctatt.eta[index].arrT;
                                    //res.write("<h1>The Arrival Time at Destination " + destinationName + " is " + sourceDestination + "</h1>");
                                    // res.render("apiData",{destinationstnArrival:destinationName,destinationArrTime:sourceDestination})
                                    // res.end();
                                    //checkBoolean = true;
                                    break;
                                  }
                                }
                                //getting crime data
                                urlCrimes =
                                  "https://data.cityofchicago.org/resource/ijzp-q8t2.json?$limit=12";
                                https.get(urlCrimes, function (response) {
                                  //console.log(response);
                                  response.on("data", function (data) {
                                    const crimeData = JSON.parse(data);
                                    // console.log(crimeData);
                                    // crimeDataa=[];
                                    // var crimeDat=[]
                                    for (let i = 0; i <= 11; i++) {
                                      let obj = {};
                                      obj.date = crimeData[i].date;
                                      obj.primary_type =
                                        crimeData[i].primary_type;
                                      obj.description =
                                        crimeData[i].description;
                                      obj.block = crimeData[i].block;
                                      //  console.log(crimeData[i].date);
                                      //  console.log(crimeData[i].primary_type);
                                      //  console.log(crimeData[i].description);
                                      //  console.log(crimeData[i].block);
                                      crimeDataa.push(obj);
                                    }
                                    console.log("printing crimedata");
                                    console.log(crimeDataa);
                                    return res.render("apiData", {
                                      queryCity: query1,
                                      queryTemperature: temp,
                                      weatherDescriptonTemperature:
                                        weatherDescripton,
                                      imageIcon: imageUrl,
                                      sourcestnArrival: stationName,
                                      sourceArrTime: sourceArrival,
                                      destinationstnArrival: destinationName,
                                      destinationArrTime: sourceDestination,
                                      crimeDataa: crimeDataa,
                                    });
                                    //console.log(" hi " + crimeDat);
                                  });
                                  // console.log(" hi " + crimeDat);
                                });

                                // console.log(
                                //   temp,
                                //   weatherDescripton,
                                //   sourceArrival,
                                //   query1,
                                //   stationName
                                // );
                                // console.log("crimeDataaa printing")
                                // console.log(crimeDataa);
                                // return res.render("apiData", {
                                //   queryCity: query1,
                                //   queryTemperature: temp,
                                //   weatherDescriptonTemperature: weatherDescripton,
                                //   imageIcon: imageUrl,
                                //   sourcestnArrival: stationName,
                                //   sourceArrTime: sourceArrival,
                                //   destinationstnArrival: destinationName,
                                //   destinationArrTime: sourceDestination,
                                //   crimeDataa :crimeDataa
                                // });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
        // console.log(obj.temp,weatherDescripton,sourceArrival,query,stationName);
        // return res.render("apiData", { queryCity: query, queryTemperature: temp, weatherDescriptonTemperature: weatherDescripton, imageIcon: imageUrl, sourcestnArrival: stationName, sourceArrTime: sourceArrival, destinationstnArrival: destinationName, destinationArrTime: sourceDestination });
      });
    }
  } catch (err) {
    console.log("Couldnt get the data as of now");
    return res.redirect("dashboard");
  }
};
