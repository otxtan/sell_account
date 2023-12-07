module.exports = (sequelize, Sequelize) => {
    const Voucher = sequelize.define('Vouchers', {
        code: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        discount_amount: {
            type: Sequelize.DECIMAL(18, 2)
        },
        discount_percentage: {
            type: Sequelize.DOUBLE
        },
        min_order_amount: {
            type: Sequelize.DECIMAL(18, 2)
        },
        start_date: {
            type: Sequelize.DATE
        },
        end_date: {
            type: Sequelize.DATE
        },
        is_fixed_discount: {
            type: Sequelize.BOOLEAN
        },
        quantity: {
            type: Sequelize.INTEGER
        },
        total: {
            type: Sequelize.INTEGER
        }
    })
    return Voucher;
};
