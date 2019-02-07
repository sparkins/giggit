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