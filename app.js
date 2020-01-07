const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const passport = require('./utils/passport').passport;
const samlRouter = require('./routes/saml');
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const apiRouter = require('./routes/api');
const logger = require("./utils/logger");
const constants = require('./config/constants');
const cli = require('node-cli-tool');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(morgan('combined', {
  stream: fs.createWriteStream(path.join(__dirname, `${constants.LOG_DIR}/access.log`), { flags: 'a' })
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
  logger.info(cli.fgGreen(req.method) + " : " + cli.fgYellow(req.originalUrl) + "    Params: " + cli.fgBlue(JSON.stringify(req.query)));
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
