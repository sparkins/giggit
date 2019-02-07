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
  app.post('/jobs/quote/:jobId', function (req, res) {
    connection.query("UPDATE jobs SET cost = ?, jobStatus = 2 WHERE jobId = ?", [req.body.newquote, req.params.jobId]
      , function (error, results) {
        console.log(results);
        if (error) throw error;
        console.log("Updated Job #" + req.params.jobId + " with quote for $" + req.body.newquote);
        // res.json("Updated Job #" + req.params.jobId + " with quote for $" + req.body.newquote);
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