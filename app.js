
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**MiddleWares starts**/
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(session({
	secret : 'mycat',
	resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


/**MiddleWares Ends**/
passport.serializeUser(function(user, done) {
	console.log(arguments);
	done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

/*
*The below strategy is used to define the login layer  
*We are using LocalStrategy because, we have 
*/
passport.use(new LocalStrategy({
   usernameField: 'username',
   passwordField : 'password'
}, function(username, password, done) {
	if(username === "azhar" && password === "12345") {
		console.info('we are ok here');
		done(null, username);
	}
	else {
		done(null, false);
	}
}));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/login', passport.authenticate('local'), function(req, res) {
	res.redirect('/home');
});

app.get('/', requireAuth, function(req, res) {
	res.render("home");
});

app.get('/login', function(req, res) {
	res.render("index");
});

app.get('/home', requireAuth, function(req, res) {
	res.render('home');
});

app.get('/anotherpage', requireAuth, function(req, res) {
	res.render("anotherpage");
});
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect("/");
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function requireAuth(req, res, next){
  // check if the user is logged in
  if(!req.isAuthenticated()){
    req.session.messages = "You need to login to view this page";
    res.redirect('/login');
  }

  next();
}