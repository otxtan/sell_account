
module.exports = (sequelize, Sequelize) => {
    const Customer = sequelize.define("Customers", {
        full_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phone_number: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email_address: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return Customer;
};