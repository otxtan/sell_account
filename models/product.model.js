module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define('Products', {
        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        content: {
            type: Sequelize.STRING
        },
        image: {
            type: Sequelize.STRING
        },
        thumbnail: {
            type: Sequelize.STRING
        },
        published:{
            type: Sequelize.BOOLEAN
        }
    })
    return Product;
}