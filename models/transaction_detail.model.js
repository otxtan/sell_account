module.exports = (sequelize, Sequelize) => {
    const Transaction_detail = sequelize.define('Transaction_details', {

        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        price: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        oldTotal: {
            type: Sequelize.DECIMAL(18, 2),
            allowNull: false
        },
        newTotal: {
            type: Sequelize.DECIMAL(18, 2),
            allowNull: true
        },
        transaction_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        AccountId: {
            type: Sequelize.INTEGER,
            allowNull: true, // Cho phép giá trị null cho cột accountId
          },
    })
    return Transaction_detail;
};