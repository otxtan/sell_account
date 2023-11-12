module.exports = (sequelize, Sequelize) => {
    const Review = sequelize.define("Reviews", {
        vote: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        review_content: {
            type: Sequelize.STRING,
            allowNull: false
        },
        review_posting_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        review_published: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        }
    });
    return Review;
};