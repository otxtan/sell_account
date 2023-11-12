module.exports = (sequelize, Sequelize) => {
    const Product_type = sequelize.define('Product_types', {
        product_type_name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    })
    return Product_type;
};
