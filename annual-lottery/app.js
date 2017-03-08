var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var admin = require('./routes/admin');
var marquee = require('./routes/marquee');
var turntable = require('./routes/turntable');
var activity = require('./routes/activity.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/data', express.static(path.join(__dirname, 'data')));

app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

app.use(function (req, res, next) {
    //if (req.path.indexOf('/s-') > 0) {
    //    var token = req.cookies["admin-token"];
    //    if (typeof token == 'undefined' || typeof global.admin == 'undefined' || token != global.admin) {
    //        res.json({retCode: -1, retMsg: "authenticated failed."});
    //        return;
    //    }
    //}
    next();
});

app.use('/admin', admin);
app.use('/marquee', marquee);
app.use('/turntable', turntable);
app.use('/activity', activity);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
