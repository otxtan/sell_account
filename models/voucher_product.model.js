
module.exports = (sequelize, Sequelize) => {
    const Vouchers_product = sequelize.define("Voucher_product", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

    });
    return Vouchers_product;
};