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
            type: Sequelize.DOUBLE,
            allowNull: true
        },
        total_amount: {
            type: Sequelize.DOUBLE,
            
        },
        total_payment:{
            type: Sequelize.DOUBLE,
            
        }

    })
    return Transaction;
};