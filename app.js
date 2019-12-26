var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs')
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var passport = require('./utils/passport').passport;

var samlRouter = require('./routes/saml');
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var apiRouter = require('./routes/api');
var logger = require("./utils/logger");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.use(morgan('combined', {
  stream: fs.createWriteStream(path.join(__dirname, '/logs/access.log'), { flags: 'a' })
}))

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({
  limit: '8mb'
}));
app.use(bodyParser.urlencoded({
  limit: '8mb',
  extended: true
})); 
app.use(passport.initialize())

app.use(function(req, res, next) {
  logger.info(req.method + " : " + req.originalUrl + "    Params: " + JSON.stringify(req.query))
  if (req.method == 'POST') {
      console.log('\x1b[36m%s\x1b[0m', 'Request URL:', req.originalUrl);
      console.log(req.body);
      logger.info(req.body)
  }
  next();
});

app.use('/api', apiRouter);
app.use('/saml', samlRouter);
app.use('/admin', adminRouter);
app.use('/', indexRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
