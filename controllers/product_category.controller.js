const { where } = require("sequelize");
const db = require("../models");
const Product_category = db.category;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");

// Create and Save a new Product_category
exports.create = async (req, res) => {
    try {
        // Validate request
        if (!req.body.product_category_name) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
            return;
        }

        // Create a Product_category
        const productCategory = {
            product_category_name: req.body.product_category_name,
        };
        if(!await Product_category.findOne({where:{product_category_name:productCategory.product_category_name}})){
            const data = await Product_category.create(productCategory);
            return res.send('added category');
        }
        res.send('category exist ')
        // Save Product_category in the database
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Product_category."
        });
    }
};

// Retrieve all Product_categorys from the database.
exports.findAll = async (req, res) => {
    try {
        const product_category_name = req.query.product_category_name;
        var condition = product_category_name ? { product_category_name: { [Op.like]: `%${product_category_name}%` } } : null;

        const data = await Product_category.findAll({ where: condition });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Product_categorys."
        });
    }
};

// Retrieve by Paging
exports.findAllByPage = async (req, res) => {
    try {
        const { page, size, product_category_name } = req.query;
        var condition = product_category_name ? { product_category_name: { [Op.like]: `%${product_category_name}%` } } : null;
        const { limit, offset } = getPagination(page, size);

        const data = await Product_category.findAndCountAll({ where: condition, limit, offset });
        const response = getPagingData(data, page, limit);
        res.send(response);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Product_categorys."
        });
    }
};

// Find a single Product_category with an id
exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Product_category.findByPk(id);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving Product_category with id=" + id
        });
    }
};

// Update a Product_category by the id in the request
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const [num] = await Product_category.update(req.body, {
            where: { id: id }
        });

        if (num == 1) {
            res.send({
                message: "Product_category was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Product_category with id=${id}. Maybe Product_category was not found or req.body is empty!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error updating Product_category with id=" + id
        });
    }
};

// Delete a Product_category with the specified id in the request
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const num = await Product_category.destroy({
            where: { id: id }
        });

        if (num == 1) {
            res.send({
                message: "Product_category was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Product_category with id=${id}. Maybe Product_category was not found!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Could not delete Product_category with id=" + id
        });
    }
};

// Delete all Product_categorys from the database.
exports.deleteAll = async (req, res) => {
    try {
        const nums = await Product_category.destroy({
            where: {},
            truncate: false
        });
        res.send({ message: `${nums} Product_categorys were deleted successfully!` });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while removing all Product_categorys."
        });
    }
};
