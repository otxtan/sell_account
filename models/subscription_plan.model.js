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
            type: Sequelize.DECIMAL(18, 2),
            allowNull: true
        },
        published: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    })
    return Subscription_plan;

}