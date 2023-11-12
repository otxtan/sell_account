module.exports = (sequelize, Sequelize) => {
    const Subscription_plan = sequelize.define('Subscription_plans', {
        packed_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        total: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        quantity_sold: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        duration: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        discount_percentage: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        price: {
            type: Sequelize.FLOAT,
            allowNull: false
        }
    })
    return Subscription_plan;

}