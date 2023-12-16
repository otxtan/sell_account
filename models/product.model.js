module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define('Products', {
        name: {
            type: Sequelize.TEXT
        },
        description: {
            type: Sequelize.TEXT
        },
        content: {
            type: Sequelize.TEXT
        },
        image: {
            type: Sequelize.TEXT
        },
        thumbnail: {
            type: Sequelize.TEXT
        },
        published:{
            type: Sequelize.BOOLEAN
        }
    })
    return Product;
}