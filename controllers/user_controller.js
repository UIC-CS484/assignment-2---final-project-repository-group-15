"use strict";
const bcrypt = require("bcrypt");
const query = require("../config/query");
const db = require("../config/sqlite3").db;
const https = require("https");
require("dotenv").config();

// Render the welcome page
module.exports.welcome = (req, res) => {
  return res.render("welcome.ejs");
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
  req.flash("error_msg", "How did you found your self here?");
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
    req.flash("success", "Logged In");
    console.log("I am IN");
    return res.redirect("/users/dashboard");
  }
  res.redirect("/users/login");
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
  const query = req.body.cityName;
  const wAPIKey = process.env.WEATHER_API_KEY;
  console.log(wAPIKey);
  //const appKey = "06a1dc9b9a352e1c0603985edec712d4";
  const measureUnits = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?" +
    "q=" +
    query +
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
  let destinationName = req.body.travelDestination;
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
  https.get(url, function (response) {
    // console.log(response.statusCode);
    response.on("data", function (data) {
      weatherData = JSON.parse(data);
      temp = weatherData.main.temp;
      weatherDescripton = weatherData.weather[0].description;
      icon = weatherData.weather[0].icon;
      imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
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
    // var stationName = req.body.travelSource;
    // var destinationName = req.body.travelDestination;
    // var trDr = 0;
    // var urlSource="";
    // var trainDataSource=" ";
    // var mapIdentiferSource = " ";
    // var mapIdSource=" ";
    // var urlDestination=" ";
    // var trainDataDestination=" ";
    // var mapIdentiferDestination=" ";
    // var mapIdDestination=" ";
    // var appKey1=" ";
    // var url1Source=" ";
    // var getRnsource=" ";
    // var rnTrainSource=" ";
    // var url2=" ";
    // var getSource=" ";
    // var sourceStn=" ";
    // var sourceArrival=" ";
    // var url1Destination=" ";
    // var getRndestination=" ";
    // var routNumberdestination = " ";
    // var  rnTrainDestination=" ";
    // var urlDesat=" ";
    // var arrivalDestination=" ";
    // var checkBoolean=" ";
    // var sourceDestination=" ";

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
                        getRndestination = JSON.parse(data); //using mapId from trainData to get route number(rn)
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
                          " The train RN are looking for " + rnTrainDestination
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
                            for (let index in arrivalDestination.ctatt.eta) {
                              if (
                                arrivalDestination.ctatt.eta[index].staNm ===
                                destinationName
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
                            console.log(
                              temp,
                              weatherDescripton,
                              sourceArrival,
                              query,
                              stationName
                            );
                            return res.render("apiData", {
                              queryCity: query,
                              queryTemperature: temp,
                              weatherDescriptonTemperature: weatherDescripton,
                              imageIcon: imageUrl,
                              sourcestnArrival: stationName,
                              sourceArrTime: sourceArrival,
                              destinationstnArrival: destinationName,
                              destinationArrTime: sourceDestination,
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
    });
    // console.log(obj.temp,weatherDescripton,sourceArrival,query,stationName);
    // return res.render("apiData", { queryCity: query, queryTemperature: temp, weatherDescriptonTemperature: weatherDescripton, imageIcon: imageUrl, sourcestnArrival: stationName, sourceArrTime: sourceArrival, destinationstnArrival: destinationName, destinationArrTime: sourceDestination });
  });

  //return res.render("apiData", { queryCity: query, queryTemperature: temp, weatherDescriptonTemperature: weatherDescripton, imageIcon: imageUrl, sourcestnArrival: stationName, sourceArrTime: sourceArrival, destinationstnArrival: destinationName, destinationArrTime: sourceDestination });
};
