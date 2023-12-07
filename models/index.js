const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
// Override timezone formatting by requiring the Sequelize and doing it here instead
// Format datetime input
Sequelize.Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
  date = this._applyTimezone(date, options);

  // Z here means current timezone, _not_ UTC
  // return date.format('YYYY-MM-DD HH:mm:ss.SSS Z');
  return date.format('YYYY-MM-DD HH:mm:ss');
};

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  options: dbConfig.options
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
sequelize.authenticate()
  .then(() => {
    console.log('Kết nối đến cơ sở dữ liệu thành công.');
  })
  .catch(err => {
    console.error('Không thể kết nối đến cơ sở dữ liệu:', err);
  });
//db.tutorials = require("./tutorial.model")(sequelize, Sequelize);
db.sequelize.sync({
  force: false
  // force: true
})
  .then(() => {
    console.log('Models synchronized with the database.');
    // You can start using the Tutorial model and perform database operations
  })
  .catch((error) => {
    console.error('Error synchronizing models:', error);
  });
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.category = require("./product_categorie.model.js")(sequelize, Sequelize);
db.customer = require("../models/customer.model.js")(sequelize, Sequelize);
db.payment_method = require("./payment_method.model.js")(sequelize, Sequelize);
db.subscription_plan = require("./subscription_plan.model.js")(sequelize, Sequelize);
db.product_type = require("../models/product_type.model.js")(sequelize, Sequelize);
db.product = require("./product.model.js")(sequelize, Sequelize);
db.review = require("../models/review.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.transaction = require("../models/transaction.models.js")(sequelize, Sequelize);
db.transaction_details = require("../models/transaction_detail.model.js")(sequelize, Sequelize);
db.voucher = require("../models/voucher.model.js")(sequelize, Sequelize);
db.account = require("../models/account.model.js")(sequelize, Sequelize);
db.cart = require("../models/cart.model.js")(sequelize, Sequelize);
db.voucherProduct = require("../models/voucher_product.model.js")(sequelize, Sequelize);
db.voucherCategory = require('../models/voucher_category.model.js')(sequelize, Sequelize);

//Associations 
//payment
db.payment_method.hasMany(db.transaction);
//voucher
db.voucher.hasMany(db.transaction);
// db.voucher.hasMany(db.transaction_details);
db.voucher.belongsToMany(db.product, { through: db.voucherProduct });
db.voucher.belongsToMany(db.category, { through: db.voucherCategory })
db.product.belongsToMany(db.voucher, { through: db.voucherProduct });
db.product.belongsTo(db.product_type);
db.product.belongsTo(db.category);
db.category.belongsToMany(db.voucher, { through: db.voucherCategory });
// db.voucherProduct = sequelize.define('Vouchers_products', {});
// db.voucher.belongsToMany(db.product, { through: voucherProduct });
// product_categories
db.category.hasMany(db.product);
// product_type
db.product_type.hasMany(db.product);
// account
db.account.hasOne(db.transaction_details);
// transaction
db.transaction.hasMany(db.transaction_details);
// product
db.product.hasMany(db.subscription_plan);
//transaction_detail
db.transaction_details.belongsTo(db.account);
db.transaction_details.belongsTo(db.subscription_plan)
db.transaction_details.hasOne(db.review);
//user
db.user.hasMany(db.transaction);
db.user.hasOne(db.customer);
db.user.belongsToMany(db.subscription_plan, { through: db.cart });
//subcription_plan
db.subscription_plan.hasMany(db.account);
db.subscription_plan.hasMany(db.transaction_details);
db.subscription_plan.belongsToMany(db.user, { through: db.cart });
db.subscription_plan.belongsTo(db.product);
db.subscription_plan.hasMany(db.transaction_details)
db.cart.belongsTo(db.subscription_plan);
db.cart.belongsTo(db.user);

//review
db.review.belongsTo(db.transaction_details);
//role
db.role.hasMany(db.user);
//cart







// 
module.exports = db;