module.exports = (sequelize, Sequelize) => {
    const Payment_method = sequelize.define('Payment_methods', {
        
        Payment_name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        Content: {
          type: Sequelize.STRING,
          allowNull: false
        }
    });
    return Payment_method;
    };