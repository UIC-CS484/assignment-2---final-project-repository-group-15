"use strict";
const bcrypt = require("bcrypt");
const query = require("../config/query");
const db = require("../config/sqlite3").db;
const https = require("https");

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
//weather API
module.exports.submit = function (req, res) {
  const query = req.body.cityName;
  const appKey = "06a1dc9b9a352e1c0603985edec712d4";
  const measureUnits = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + query + "&appid=" + appKey + "&units=" + measureUnits;
  https.get(url, function (response) {
    // console.log(response.statusCode);
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp_min;
      const weatherDescripton = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write(" <h1>Temperature in " + query + " is: " + temp + " degree celsius</h1>");
      res.write("<p>weather description : " + weatherDescripton + "</p>");
      res.write("<img src=" + imageUrl + ">");
      //res.end();
    })
  //})


//CTA API


  
    const blueLine = ["Forest Park", "Harlem", "Oak Park", "Austin", "Central", "Cicero", "Kostner", "Pulaski", "Kedzie-Homan", "California", "Western", "Illinois Medical District", "Racine", "UIC-Halsted", "Clinton", "LaSalle", "Jackson", "Monroe", "Washington", "Clark/lake", "Grand", "Chicago", "Divison", "Damen", "Western", "California", "Logan Square", "Belmont", "Addison", "Irving Park", "Montrose", "Jefferson Park", "Harlem", "Cumberland", "Rosemont", "O'Hare"];
    const stationName = req.body.travelSource;
    const destinationName = req.body.travelDestination;
    var trDr = 0;


    if (blueLine.indexOf(stationName) > blueLine.indexOf(destinationName)) {
      res.write("");
      trDr = 5;
    }
    else {
      trDr = 1;
      res.write("");
    }

    const urlSource = "https://data.cityofchicago.org/resource/8pix-ypme.json?" + "station_name=" + stationName;
    https.get(urlSource, function (response) {
      response.on("data", function (data) {
        const trainDataSource = JSON.parse(data);
        //code to get mapid for blue=ture
        var mapIdentiferSource = "";
        for (let index in trainDataSource) {
          if (trainDataSource[index].blue) {
            mapIdentiferSource = trainDataSource[index].map_id;
            //res.write(trainData[index].map_id);
            break;
          }

        }
        const mapIdSource = mapIdentiferSource; //Identifying Mapid

        // getting destination map id
        const urlDestination = "https://data.cityofchicago.org/resource/8pix-ypme.json?" + "station_name=" + destinationName;
        https.get(urlDestination, function (response) {
          response.on("data", function (data) {
            const trainDataDestination = JSON.parse(data);
            //code to get mapid for blue=ture
            var mapIdentiferDestination = "";
            for (let index in trainDataDestination) {

              if (trainDataDestination[index].blue) {
                mapIdentiferDestination = trainDataDestination[index].map_id;
                //res.write(trainData[index].map_id);
                break;
              }

            }
            const mapIdDestination = mapIdentiferDestination;//ends here
            //console.log(mapIdDestination);
            const appKey1 = "75fc11dc6cb84224a21a82c48b133ce3";

            const url1Source = "https://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?" + "key=" + appKey1 + "&mapid=" + mapIdSource + "&rt=blue&outputType=JSON";
            https.get(url1Source, function (response) {
              response.on("data", function (data) {
                const getRnsource = JSON.parse(data);//using mapId from trainData to get route number(rn)
                var routNumber = " ";
                for (let index in getRnsource.ctatt.eta) {
                  if (trDr == getRnsource.ctatt.eta[index].trDr) {
                    routNumber = getRnsource.ctatt.eta[index].rn;
                    break;
                  }
                }
                const rnTrainSource = routNumber;//getting route number[0] as the earliest train's r is displayed first





                const url2 = "https://lapi.transitchicago.com/api/1.0/ttfollow.aspx?" + "key=" + appKey1 + "&runnumber=" + rnTrainSource + "&outputType=JSON";
                https.get(url2, function (response) {
                  response.on("data", function (data) {
                    const getSource = JSON.parse(data);
                    var sourceStn = getSource.ctatt.eta;
                    //console.log(sourceStn);
                    for (let index in sourceStn) {
                      if (sourceStn[index].staNm === stationName) {
                        res.write("<h1>The Arrival Time at Source " + stationName + " is " + sourceStn[index].arrT + "</h1>");
                        break;
                      }
                    }

                    //dest map id processing and getting dest time
                    const url1Destination = "https://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?" + "key=" + appKey1 + "&mapid=" + mapIdDestination + "&rt=blue&outputType=JSON";
                    https.get(url1Destination, function (response) {
                      response.on("data", function (data) {
                        const getRndestination = JSON.parse(data);//using mapId from trainData to get route number(rn)
                        var routNumberdestination = " ";
                        for (let index in getRndestination.ctatt.eta) {
                          if (rnTrainSource == getRnsource.ctatt.eta[index].rn) {
                            routNumberdestination = getRnsource.ctatt.eta[index].rn;
                            break;
                          }
                        }
                        const rnTrainDestination = routNumberdestination;//getting route number[0] as the earliest train's r is displayed first
                        console.log(" The train RN are looking for " + rnTrainDestination);
                        //get destination arrival time
                        const urlDesat = "https://lapi.transitchicago.com/api/1.0/ttfollow.aspx?" + "key=" + appKey1 + "&runnumber=" + rnTrainDestination + "&outputType=JSON";
                        https.get(urlDesat, function (response) {
                          response.on("data", function (data) {
                            const arrivalDestination = JSON.parse(data);
                            var checkBoolean = false;
                            for (let index in arrivalDestination.ctatt.eta) {

                              if (arrivalDestination.ctatt.eta[index].staNm === destinationName) {
                                res.write("<h1>The Arrival Time at Destination " + destinationName + " is " + arrivalDestination.ctatt.eta[index].arrT + "</h1>");
                                res.end();
                                checkBoolean = true;
                                break;
                              }
                            }
                            if (checkBoolean == false) {
                              res.write("<h1> no ETA to Destination  at the moment </h1>");
                              res.end();
                            }

                          })
                        })


                      })
                    })

                  })
                })

              })
            })

          })

        })
      })
    })
  })
  

  
}
// //weather API
// module.exports.submit = function (req, res) {
//   const query = req.body.cityName;
//   const appKey = "06a1dc9b9a352e1c0603985edec712d4";
//   const measureUnits = "metric";
//   const url = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + query + "&appid=" + appKey + "&units=" + measureUnits;
//   https.get(url, function (response) {
//     // console.log(response.statusCode);
//     response.on("data", function (data) {
//       const weatherData = JSON.parse(data);
//       const temp = weatherData.main.temp_min;
//       const weatherDescripton = weatherData.weather[0].description;
//       const icon = weatherData.weather[0].icon;
//       const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
//       res.write(" <h1>Temperature in " + query + " is: " + temp + " degree celsius</h1>");
//       res.write("<p>weather description : " + weatherDescripton + "</p>");
//       res.write("<img src=" + imageUrl + ">");
//       res.end();
//     })
//   })
// }

// //CTA API

// module.exports.getTimes = function (req, res) {
  
//     const blueLine = ["Forest Park", "Harlem", "Oak Park", "Austin", "Central", "Cicero", "Kostner", "Pulaski", "Kedzie-Homan", "California", "Western", "Illinois Medical District", "Racine", "UIC-Halsted", "Clinton", "LaSalle", "Jackson", "Monroe", "Washington", "Clark/lake", "Grand", "Chicago", "Divison", "Damen", "Western", "California", "Logan Square", "Belmont", "Addison", "Irving Park", "Montrose", "Jefferson Park", "Harlem", "Cumberland", "Rosemont", "O'Hare"];
//     const stationName = req.body.travelSource;
//     const destinationName = req.body.travelDestination;
//     var trDr = 0;


//     if (blueLine.indexOf(stationName) > blueLine.indexOf(destinationName)) {
//       res.write("");
//       trDr = 5;
//     }
//     else {
//       trDr = 1;
//       res.write("");
//     }

//     const urlSource = "https://data.cityofchicago.org/resource/8pix-ypme.json?" + "station_name=" + stationName;
//     https.get(urlSource, function (response) {
//       response.on("data", function (data) {
//         const trainDataSource = JSON.parse(data);
//         //code to get mapid for blue=ture
//         var mapIdentiferSource = "";
//         for (let index in trainDataSource) {
//           if (trainDataSource[index].blue) {
//             mapIdentiferSource = trainDataSource[index].map_id;
//             //res.write(trainData[index].map_id);
//             break;
//           }

//         }
//         const mapIdSource = mapIdentiferSource; //Identifying Mapid

//         // getting destination map id
//         const urlDestination = "https://data.cityofchicago.org/resource/8pix-ypme.json?" + "station_name=" + destinationName;
//         https.get(urlDestination, function (response) {
//           response.on("data", function (data) {
//             const trainDataDestination = JSON.parse(data);
//             //code to get mapid for blue=ture
//             var mapIdentiferDestination = "";
//             for (let index in trainDataDestination) {

//               if (trainDataDestination[index].blue) {
//                 mapIdentiferDestination = trainDataDestination[index].map_id;
//                 //res.write(trainData[index].map_id);
//                 break;
//               }

//             }
//             const mapIdDestination = mapIdentiferDestination;//ends here
//             //console.log(mapIdDestination);
//             const appKey = "75fc11dc6cb84224a21a82c48b133ce3";

//             const url1Source = "https://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?" + "key=" + appKey + "&mapid=" + mapIdSource + "&rt=blue&outputType=JSON";
//             https.get(url1Source, function (response) {
//               response.on("data", function (data) {
//                 const getRnsource = JSON.parse(data);//using mapId from trainData to get route number(rn)
//                 var routNumber = " ";
//                 for (let index in getRnsource.ctatt.eta) {
//                   if (trDr == getRnsource.ctatt.eta[index].trDr) {
//                     routNumber = getRnsource.ctatt.eta[index].rn;
//                     break;
//                   }
//                 }
//                 const rnTrainSource = routNumber;//getting route number[0] as the earliest train's r is displayed first





//                 const url2 = "https://lapi.transitchicago.com/api/1.0/ttfollow.aspx?" + "key=" + appKey + "&runnumber=" + rnTrainSource + "&outputType=JSON";
//                 https.get(url2, function (response) {
//                   response.on("data", function (data) {
//                     const getSource = JSON.parse(data);
//                     var sourceStn = getSource.ctatt.eta;
//                     //console.log(sourceStn);
//                     for (let index in sourceStn) {
//                       if (sourceStn[index].staNm === stationName) {
//                         res.write("<h1>The Arrival Time at Source " + stationName + " is " + sourceStn[index].arrT + "</h1>");
//                         break;
//                       }
//                     }

//                     //dest map id processing and getting dest time
//                     const url1Destination = "https://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?" + "key=" + appKey + "&mapid=" + mapIdDestination + "&rt=blue&outputType=JSON";
//                     https.get(url1Destination, function (response) {
//                       response.on("data", function (data) {
//                         const getRndestination = JSON.parse(data);//using mapId from trainData to get route number(rn)
//                         var routNumberdestination = " ";
//                         for (let index in getRndestination.ctatt.eta) {
//                           if (rnTrainSource == getRnsource.ctatt.eta[index].rn) {
//                             routNumberdestination = getRnsource.ctatt.eta[index].rn;
//                             break;
//                           }
//                         }
//                         const rnTrainDestination = routNumberdestination;//getting route number[0] as the earliest train's r is displayed first
//                         console.log(" The train RN are looking for " + rnTrainDestination);
//                         //get destination arrival time
//                         const urlDesat = "https://lapi.transitchicago.com/api/1.0/ttfollow.aspx?" + "key=" + appKey + "&runnumber=" + rnTrainDestination + "&outputType=JSON";
//                         https.get(urlDesat, function (response) {
//                           response.on("data", function (data) {
//                             const arrivalDestination = JSON.parse(data);
//                             var checkBoolean = false;
//                             for (let index in arrivalDestination.ctatt.eta) {

//                               if (arrivalDestination.ctatt.eta[index].staNm === destinationName) {
//                                 res.write("<h1>The Arrival Time at Destination " + destinationName + " is " + arrivalDestination.ctatt.eta[index].arrT + "</h1>");
//                                 res.end();
//                                 checkBoolean = true;
//                                 break;
//                               }
//                             }
//                             if (checkBoolean == false) {
//                               res.write("<h1> no ETA to Destination  at the moment </h1>");
//                               res.end();
//                             }

//                           })
//                         })


//                       })
//                     })

//                   })
//                 })

//               })
//             })

//           })

//         })
//       })
//     })
  

  
// }
