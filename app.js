var express = require('express');
var createError = require('http-errors');
var helmet = require('helmet');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression')

var pageRouter = require('./routes/page');
var ajaxRouter = require('./routes/ajax')

var utils = require("./controller/customUtil")
const mongoose_connection = require("./mongo")

var app = express();
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);


if (process.env.ENV !== "production"){
    // Tell express to use the webpack-dev-middleware and use the webpack.config.js
    // configuration file as a base.
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const config = require('./webpack.dev.js');
    const compiler = webpack(config);
    app.use(webpackDevMiddleware(compiler, {
        noInfo: true, publicPath: config.output.publicPath,
    }));
    app.use(require("webpack-hot-middleware")(compiler));
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(helmet());
app.use(compression())


app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.set('trust proxy',1)
//app.use(cors(corsOptions))
app.use(session({
    name: "prandom",
    resave: false,
    saveUninitialized: false,
    secret: "prandom",
    cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        secure: true
    },
    store: new MongoStore({ 
        mongooseConnection: mongoose_connection ,
        touchAfter : 24 * 3600, // lazy session update
        secret : 'squirrel' // encryption
    })
}));



app.use(express.static(path.join(__dirname, 'public')));


app.use('/', pageRouter);
app.use('/ajax', utils.isAjax , ajaxRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
