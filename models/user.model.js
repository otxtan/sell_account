module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("Users", {
    
        username: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        salt: {
            type: Sequelize.STRING
        },
        status:{
            type: Sequelize.BOOLEAN
        }
    });
    return User;
};