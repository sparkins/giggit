var express = require('express');

var app = express();

 var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));

app.set("view engine", "handlebars"); 

app.use(express.static("public"));

var cookieParser = require('cookie-parser');

var session = require('express-session');

	//allow sessions
	app.use(session({ key: "user_sid" , secret: 'app', cookie: { maxAge: 1*1000*60*60*24*365 }}));

	app.use(cookieParser());


var PORT = process.env.PORT || 3000;

require('./routing/apiRoutes')(app);
require('./routing/htmlRoutes')(app);

app.listen(PORT, function(){
	console.log('listening on '+PORT);
});
