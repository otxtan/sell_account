module.exports = (sequelize, Sequelize) => {
    const Account = sequelize.define('Accounts', {
        
        // username: {
        //     type: Sequelize.STRING,
        //     allowNull: false
        // },
        // email: {
        //     type: Sequelize.STRING,
        //     allowNull: false
        // },
        // password: {
        //     type: Sequelize.STRING,
        //     allowNull: false
        // },
        // active_key: {
        //     type: Sequelize.STRING,
        //     allowNull: false
        // },
        information: {
            type: Sequelize.STRING,
            allowNull: false
        },
        status: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    })
    return Account;
}