// Require external libraries
var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var path = require('path');

// var mysql = require('mysql');
var connection = require('../controllers/connections.js');

var bcrypt = require('bcryptjs');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride());
var connection = require('../controllers/connections.js');

// Connecting apiRoutes to server.js, making sure routes are available when server.js is running
module.exports = function (app) {
  var express = require("express");
  app.use(bodyParser.urlencoded({ extended: false }))

  // ********   Home Route        ********
  app.get("/", function (req, res) {
    res.render("home")
  })


  // *************************************
  // ******** SIGNUP/LOGIN ROUTES ********
  // *************************************

  // Sign Up Form Data
  app.post('/signup', function (req, res) {
    var bus = req.body.isbus;
    if (bus === "true")
      bus = 1;
    else
      bus = 0;

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(req.body.password, salt, function (err, p_hash) {

        connection.query("INSERT INTO users (username, email, password_hash, isABusiness) values(?,?,?,?)", [req.body.username, req.body.email, p_hash, bus], function (err, results, fields) {
          if (err)
            res.status(500).send('Ooops!..Email address already Exist ');
          else {
            var Id = results.insertId;
            connection.query("select * from users where userid = (?)", [Id], function (err, rows, fields) {
              req.session.user_id = rows[0].userId;
              req.session.email = rows[0].email;
              req.session.username = rows[0].username;
              //res.redirect('/start')
              if (rows[0].isABusiness === 1)
                res.render("businesshome", { connected: req.session.username, user: results[0] })
              //console.log(results[0])
              else
                res.render("userhome", { connected: req.session.username, user: results[0] })
            })
          }
        })
      })
    })
  })

  //                 **** check session before rendering page *****
  /*                  if (req.session.user_id && req.cookies.user_sid) 
                   {
                       res.render("index", { user: req.session.username })
                   }
                     else 
                   {
                     res.render("logon")
                   }
  
  */

  // Sign In Form Data
  app.post('/signin', function (req, res) {
    connection.query('SELECT * FROM users WHERE email = ?', [req.body.email], function (error, results, fields) {
      if (error)
        throw error;
      if (results.length == 0) {
        res.status(500).send('Ooops!..Email address dose not Exist ');
      }
      else {
        bcrypt.compare(req.body.password, results[0].password_hash, function (err, result) {
          if (result == true) {
            req.session.isABusiness = results[0].isABusiness;
            req.session.user_id = results[0].id;
            req.session.email = results[0].email;
            req.session.username = results[0].username;
            if (req.session.isABusiness === 1){
              res.render('businesshome.handlebars', {connected: req.session.username, user: results[0]});

              // app.get('business-home', function(req, res){
              //   res.render('businesshome.handlebars', {connected: req.session.username, user:results[0]})
              // })

              app.get('/business-edit', function (req, res) {
                res.render('business-edit.handlebars', {connected: req.session.username, user: results[0] });
              })
              app.get('/business-search', function (req, res) {
                res.render('business-search.handlebars', {connected: req.session.username, user: results[0] });
              })
              app.get('/business-reviews', function (req, res) {
                res.render('business-reviews.handlebars', {connected: req.session.username, user: results[0] });
              })
              app.get('/business-home', function (req, res) {
                res.render('businesshome.handlebars', {connected: req.session.username, user: results[0] });
              })
              

            //console.log(results[0])
          }else
              res.render("userhome.handlebars", { connected: req.session.username, user: results[0] })

            app.get('/user-edit', function (req, res) {
              res.render('user-edit.handlebars', {connected: req.session.username, user: results[0] });
            })

            app.get('/user-search', function (req, res) {
              res.render('user-search.handlebars', {connected: req.session.username, user: results[0] });
            })

            app.get('/user-review', function (req, res) {
              res.render('user-review.handlebars', {connected: req.session.username, user: results[0] });
            })

            app.get('/user-business', function (req, res) {
              res.render('user-business.handlebars', {connected: req.session.username, user: results[0] });
            })

            app.get('/user-home', function (req, res) {
              res.render('userhome.handlebars', {connected: req.session.username, user: results[0] });
            })

          }
          else {
            res.status(500).send('Invalid password... ');
          }
        });
      }
    })
  });

  // logout
  app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
      if(err) throw err;
      res.render("home");
    })
  });

  // *************************************
  // ********** BUSINESS ROUTES **********
  // *************************************

  // get route for /businesses - display all businesses to the browser
  app.get('/businesses', function (req, res) {
    connection.query('SELECT * FROM businesses', function (error, results, fields) {
      if (error) throw error;
      res.json(results);
    });
  });

  // Get route to get all business info from business, category, jobs and user tables for the business home page
  app.get('/business/allinfo/:businessId', function (req, res) {
    connection.query('SELECT b.businessId, b.business_name, b.business_bio, b.categoryId, c.category_name, j.jobId, j.rating, j.review, j.jobStatus, j.cost, u.userId, u.username FROM businesses b LEFT JOIN categories c ON c.categoryId=b.categoryId LEFT JOIN jobs j ON j.businessId=b.businessId LEFT JOIN users u ON j.userId=u.userId WHERE b.businessId = ?', [req.params.businessId]
      , function (error, results, fields) {
        if (error) throw error;
        res.json(results);
      })
  })

  // Get route to get all business info from business, category, jobs and user tables for the business home page
  app.get('/business/userInfo/:businessId/:userId', function (req, res) {
    connection.query('SELECT b.businessId, b.business_name, b.business_bio, b.categoryId, c.category_name, j.jobId, j.jobStatus, j.cost, u.userId, u.username, u.email FROM businesses b LEFT JOIN categories c ON c.categoryId=b.categoryId LEFT JOIN jobs j ON j.businessId=b.businessId LEFT JOIN users u ON j.userId=u.userId WHERE b.businessId = ? && u.userId = ?', [req.params.businessId, req.params.userId]
      , function (error, results, fields) {
        if (error) throw error;
        res.json(results);
      })
  })

  //route for providing the average rating for a business
  app.get('/businesses/rating/:businessId', function (req, res) {
    connection.query("SELECT b.businessId, b.business_name, j.rating FROM businesses b LEFT JOIN jobs j ON j.businessId=b.businessId WHERE b.businessId = ?", [req.params.businessId]
      , function (error, results) {
        // console.log(results[0].rating);
        if (error) throw error;
        var ratingArray = [];
        for (i = 0; i < results.length; i++) {
          console.log(results[i].rating);
          ratingArray.push(results[i].rating)
        }
        var sum = ratingArray.reduce(function (total, currentVal) {
          return total + currentVal;
        })
        res.send(`Average Rating for ${results[0].business_name} = ${(sum / results.length).toFixed(2)}`);
      })
  })

  //route for providing a list of reviews for a  specific business
  app.get('/businesses/reviews/:businessId', function (req, res) {
    connection.query("SELECT b.businessId, b.business_name, j.review FROM businesses b LEFT JOIN jobs j ON j.businessId=b.businessId WHERE b.businessId = ?", [req.params.businessId]
      , function (error, results) {
        //console.log(results);
        if (error) throw error;
        res.json(results);
      })
  })

  //Get route for providing a list of jobs for a specific business
  app.get('/businesses/jobs/:businessId', function (req, res) {
    connection.query("SELECT b.businessId, b.business_name, j.jobId, j.rating, j.review, j.cost, j.jobStatus FROM businesses b LEFT JOIN jobs j ON b.businessId=j.businessId WHERE b.businessId = ?", [req.params.businessId]
      , function (error, results) {
        //console.log(results);
        if (error) throw error;
        res.json(results);
      })
  })

  // *************************************
  // ********** CATEGORY ROUTES **********
  // *************************************

  // get route for /categories - display all categories to the browser
  app.get('/categories', function (req, res) {
    connection.query('SELECT * FROM categories', function (error, results, fields) {
      if (error) throw error;
      res.json(results);
    });
  });

  //Get route for providing all the businesses for a specific category
  app.get('/categories/:categoryId', function (req, res) {
    connection.query("SELECT c.categoryId, c.category_name, b.businessId, b.business_name, b.business_bio FROM categories c LEFT JOIN businesses b ON c.categoryId=b.categoryId WHERE c.categoryId = ?", [req.params.categoryId]
      , function (error, results) {
        // console.log(results[0].rating);
        if (error) throw error;
        res.send(results);
      })
  })

  //Post route to insert a new category
  app.post('/categories/add-category', function (req, res) {
    console.log(req.query);
    connection.query('INSERT INTO categories (category_name) VALUES (?)', [req.query.categoryName], function (err, res) {
      if (err) {
        console.log('there was an error');
        return res.status(500).end();
      }
      console.log('Category: ' + req.query.categoryName + 'was added');
      res.redirect('/categories');
    })
  })

  //Get route for providing all the businesses for a specific category
  app.get('/categories/:categoryId', function (req, res) {
    connection.query("SELECT c.categoryId, c.category_name, b.businessId, b.business_name, b.business_bio FROM categories c LEFT JOIN businesses b ON c.categoryId=b.categoryId WHERE c.categoryId = ?", [req.params.categoryId]
      , function (error, results) {
        // console.log(results[0].rating);
        if (error) throw error;
        res.send(results);
      })
  })

  // *************************************
  // ************ USER ROUTES ************
  // *************************************

  // get route for /users - display all users to the browser
  app.get('/users', function (req, res) {
    connection.query('SELECT * FROM users', function (error, results, fields) {
      if (error) throw error;
      res.json(results);
    });
  });

  // Get route to get all user info from user, business, category and jobs tables for the users home page
  app.get('/users/allinfo/:userId', function (req, res) {
    connection.query('SELECT u.userId, u.isABusiness, u.username, u.email, j.jobId, j.rating, j.review, j.jobStatus, j.cost, b.businessId, b.business_name, c.categoryId, c.category_name FROM users u LEFT JOIN jobs j ON u.userId=j.userId LEFT JOIN businesses b ON b.businessId=j.businessId LEFT JOIN categories c ON c.categoryId=b.categoryId WHERE u.userId = ?', [req.params.userId]
      , function (error, results, fields) {
        if (error) throw error;
        res.json(results);
      })
  })

  // Get route to get all user info from user, business, category and jobs tables for the business profile page (USERS Perspective)
  app.get('/users/businessInfo/:userId/:businessId', function (req, res) {
    connection.query('SELECT u.userId, u.username, u.email, j.jobId, j.rating, j.review, j.jobStatus, j.cost, b.businessId, b.business_name, c.categoryId, c.category_name FROM users u LEFT JOIN jobs j ON u.userId=j.userId LEFT JOIN businesses b ON b.businessId=j.businessId LEFT JOIN categories c ON c.categoryId=b.categoryId WHERE u.userId = ? && b.businessId = ?', [req.params.userId, req.params.businessId]
      , function (error, results, fields) {
        if (error) throw error;
        res.json(results);
      })
  })

  //route for providing a list of jobs for a specific user
  app.get('/users/jobs/:userId', function (req, res) {
    connection.query("SELECT u.userId, u.username, j.jobId, j.rating, j.review, j.cost, j.jobStatus FROM users u LEFT JOIN jobs j ON u.userId=j.userId WHERE u.userId = ?", [req.params.userId]
      , function (error, results) {
        //console.log(results);
        if (error) throw error;
        res.json(results);
      })
  })

  // *************************************
  // ************ JOBS ROUTES ************
  // *************************************

  // post route to create a new job
  app.post('/jobs/create-job/:userId/:businessId/:categoryId', function (req, res) {
    connection.query("INSERT INTO jobs (userId, businessId, categoryId, jobStatus) VALUES (?, ?, ?, 1)", [req.params.userId, req.params.businessId, req.params.categoryId]
      , function (error, results) {
        console.log(results);
        if (error) throw error;
        res.json("New Job Added for " + req.params.userId);
      })
  })

  // put route to update a job with a QUOTE from the business
  app.put('/jobs/quote/:cost/:jobId', function (req, res) {
    connection.query("UPDATE jobs SET cost = ?, jobStatus = 2 WHERE jobId = ?", [req.params.cost, req.params.jobId]
      , function (error, results) {
        console.log(results);
        if (error) throw error;
        res.json("Updated Job #" + req.params.jobId + " with quote for $" + req.params.cost);
      })
  })

  // put route to update a job when the user ACCEPTS the job
  app.put('/jobs/accept-job/:jobId', function (req, res) {
    connection.query("UPDATE jobs SET jobStatus = 3 WHERE jobId = ?", [req.params.jobId]
      , function (error, results) {
        console.log(results);
        if (error) throw error;
        res.json("Accepted Job #" + req.params.jobId);
      })
  })

  // put route to update a job when the user DECLINES the job
  app.put('/jobs/decline-job/:jobId', function (req, res) {
    connection.query("UPDATE jobs SET jobStatus = 4 WHERE jobId = ?", [req.params.jobId]
      , function (error, results) {
        console.log(results);
        if (error) throw error;
        res.json("Declined Job #" + req.params.jobId);
      })
  })


  //a route for all info for use in ajax calls (added by alyssa 1-20-19)
  //IMPORTANT ROUTE - 
  app.get('/alldata', function (req, res) {
    connection.query('SELECT b.businessId, b.business_name, b.business_bio, b.categoryId, c.category_name, j.jobId, j.rating, j.review, j.jobStatus, j.cost, u.userId, u.username FROM businesses b LEFT JOIN categories c ON c.categoryId=b.categoryId LEFT JOIN jobs j ON j.businessId=b.businessId LEFT JOIN users u ON j.userId=u.userId', function (error, results, fields) {
      if (error) throw error;
      res.json(results);
    })
  })
  //This route is being used in user-search and business-search. If you edit or delete this route, please make adjustments to the ajax scripts in handlebars pages to make sure they still work
  app.get('/businesscategory', function (req, res) {
    connection.query('SELECT * FROM businesses LEFT JOIN categories ON businesses.categoryId=categories.categoryId', function (error, results, fields) {
      if (error) throw error;
      res.json(results);
    })
  })

}

