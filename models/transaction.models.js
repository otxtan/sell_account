module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define('Transactions', {

       
        transaction_date: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        transaction_status: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        total_discount: {
            type: Sequelize.DECIMAL(18, 2),
            allowNull: true
        },
        total_amount: {
            type: Sequelize.DECIMAL(18, 2),
            
        },
        total_payment:{
            type: Sequelize.DECIMAL(18, 2),
            
        }

    })
    return Transaction;
};