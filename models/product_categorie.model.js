module.exports=(sequelize,Sequelize)=>{
    const Product_categorie =sequelize.define('Product_categories',{
        product_category_name:{
            type: Sequelize.STRING,
            allowNull: false
        },
    })
    return Product_categorie;
};