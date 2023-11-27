var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var accountRouter = require('./routes/account.routes');
var customerRouter = require('./routes/customer.routes');
var cart = require('./routes/cart.routes');
var paymentMethodRouter = require('./routes/payment_method.routes');
var productRouter = require('./routes/product.routes');
var product_categoryRouter = require('./routes/product_category.routes');
var product_typeRouter = require('./routes/product_type.routes');
var reviewRouter = require('./routes/review.routes');
var roleRouter = require('./routes/role.routes');
var subscription_planRouter = require('./routes/subscription_plan.routes');
var transactionRouter = require('./routes/transaction.routes');
var transaction_detailRouter = require('./routes/transaction_detail.routes');
var userRouter = require('./routes/user.routes');
var voucherRouter = require('./routes/voucher.routes');
var voucher_productRouter=require('./routes/voucher_product.routes');
var voucher_categoryRouter=require('./routes/voucher_category.routes');
var authsRouter=require('./routes/auth.routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/account', accountRouter);
app.use('/customer', customerRouter);
app.use('/payment_method', paymentMethodRouter);
app.use('/product', productRouter);
app.use('/product_category', product_categoryRouter);
app.use('/product_type', product_typeRouter);
app.use('/review', reviewRouter);
app.use('/role', roleRouter);
app.use('/subscription_plan', subscription_planRouter);
app.use('/transaction', transactionRouter);
app.use('/transaction_detail', transaction_detailRouter);
app.use('/user', userRouter);
app.use('/voucher', voucherRouter);
app.use('/auth',authsRouter);
app.use('/cart',cart);
app.use('/voucher_product',voucher_productRouter);
app.use('/voucher_category',voucher_categoryRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

const PORT = process.env.PORT || 80;
app.use(cors({
  origin: 'http://localhost:3000',
}));
var server = app.listen(80, function() {
  console.log('Ready on port %d', server.address().port);
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
