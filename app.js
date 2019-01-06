var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var querystring = require('querystring');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookie = require('cookie');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');
var sessions = require("client-sessions");
var fs = require('fs');
var hbs =require('hbs');
var url = require('url');
var formidable = require('formidable');
var iconvlite = require('iconv-lite');
//database

var port = 3000;

var db = require('./lib/DB');








//routing variables

var index = require('./routes/index');
var users = require('./routes/users');
var register= require('./routes/register.js');
var login = require('./routes/login.js');
var logout = require('./routes/logout.js');
var test = require('./routes/test.js');
var api = require('./routes/api.js');
var project_list=require('./routes/project-list');
var project_template=require('./routes/project-template.js');
var transaction_to_projects=require('./routes/transactions-to-projects');
var user_profile=require('./routes/user-profile');
var create_project = require('./routes/create-project');
var test_table = require('./routes/testtable');
var test2 = require('./routes/test2.js');
var upload =require('./routes/upload.js');
//additional configuration
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
require('./lib/io')(io);
//session






// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');



// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', '/images/iem-favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/project-template', express.static(path.join(__dirname, 'public')));
// Use express-session middleware for express
module.exports = cookieconf={
    cookieName: 'sessval', // cookie name dictates the key name added to the request object
    secret: 'ninjakornjace', // should be a large unguessable string
    duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
    cookie: {
        // path: '/api', // cookie will only be sent to requests under '/api'
        // maxAge: 60000, // duration of the cookie in milliseconds, defaults to duration above
        ephemeral: true // when true, cookie expires when the browser closes
        //httpOnly: true, // when true, cookie is not accessible from javascript
        //secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
    }
};
app.use(sessions({
    cookieName: 'sessval', // cookie name dictates the key name added to the request object
    secret: 'ninjakornjace', // should be a large unguessable string
    duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
    cookie: {
       // path: '/api', // cookie will only be sent to requests under '/api'
       // maxAge: 60000, // duration of the cookie in milliseconds, defaults to duration above
       ephemeral: true // when true, cookie expires when the browser closes
        //httpOnly: true, // when true, cookie is not accessible from javascript
        //secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
    }
}));







//io usage
var username="a";
var password="a";




//routes

app.use('/', login);
app.use('/users', users);
app.use('/register', register);
app.use('/login',login);
app.use('/logout',logout);
app.use('/test', test);
app.use('/api', api);
app.use('/upload',upload);
app.use('/project-list',project_list);
app.use('/project-template', project_template);
app.use('/transactions-to-projects',transaction_to_projects);
app.use('user-profile',user_profile);
app.use('/create-project', create_project);
app.use('/test2',test2);
app.use('/testtable', test_table);

//use upload



// catch 404 and forward to error handler
app.use(function(req, res, next) {
var err = new Error('Not Found');
err.status = 404;
next(err);
});

// error handler
app.use(function(err, req, res, next) {
// set locals, only providing error in development
res.locals.message = err.message;
res.locals.error = req.app.get('env') === 'development' ? err : {};

// render the error page
res.status(err.status || 500);
res.render('error');
});






//server start
http.listen(port,function(){
console.log('Server started on port ' + port);

});

module.exports = app;







