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

  //Post route to update a job and add a rating and review
  app.post('/jobs/add-review/:jobId', function (req, res) {
    connection.query("UPDATE jobs SET rating = ?, review = ? WHERE jobId = ?", [req.body.rating, req.body.review, req.params.jobId]
      , function (error, results) {
        console.log(results);
        if (error) throw error;
        console.log ("New review added for " + req.params.jobId);
        res.render('userhome.handlebars', {connected: req.session.username, user: results[0] });

      })
  })