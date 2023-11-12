
module.exports = (sequelize, Sequelize) => {
    const Vouchers_categories = sequelize.define("Voucher_category", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        

    });
    return Vouchers_categories;
};