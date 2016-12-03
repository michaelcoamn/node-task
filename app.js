var express = require('express');
var path = require('path');
var expressValidator = require('express-validator');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// MongoDB variables 
var db = require('./db').db;

var index = require('./routes/index');
var stores = require('./routes/stores');
var products = require('./routes/products');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());

//  validator
app.use(expressValidator({
 customValidators: {
    containsField: function(value) {
        return ["price", "shipping", "sku", "title", "brand", "store_id"].includes(value);
    },
    isValidValueForField: function(value, field) 
    {
        if (value && field == "price")
        {
          // returns if the value is an number
          return isFinite(value);
        }

        return true;
    },
    isValidSort(value){
      if(value){
        if(!isFinite(value)){
          return false;
        }

        var sort = Number(value);

        if(sort != 1 && sort != -1){
          return false;
        }
      }

      return true
    },

    isPosInt(val)
    {
      return isFinite(val) && Number(val) > 0;
    }
 }
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', index);
app.use('/stores', stores);
app.use('/products', products);

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

module.exports = app;
