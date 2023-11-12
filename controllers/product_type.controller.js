const db = require("../models");
const Product_type = db.product_type;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");

// Create and Save a new Product_type
exports.create = (req, res) => {
    // Validate request
    if (!req.body.product_type_name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a Product_type
    const productType = {
        product_type_name: req.body.product_type_name,

    };

    // Save Product_type in the database
    Product_type.create(productType)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Product_type."
            });
        });
};
// Retrieve all Product_types from the database.
exports.findAll = (req, res) => {
    const product_type_name = req.query.product_type_name;
    var condition = product_type_name ? { product_type_name: { [Op.like]: `%${product_type_name}%` } } : null;
    Product_type.findAll(
        // {
        //     include: [{// Notice `include` takes an ARRAY
        //       model: Category
        //     }]
        //   }
        {
            where: condition

        }
    )
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Product_types."
            });
        });
};
// Retrieve by Paging
exports.findAllByPage = (req, res) => {
    const { page, size, product_type_name } = req.query;
    var condition = product_type_name ? { product_type_name: { [Op.like]: `%${product_type_name}%` } } : null;
    const { limit, offset } = getPagination(page, size);
    Product_type.findAndCountAll({
        // include: [{// Notice `include` takes an ARRAY
        //     model: Category
        // }],
        where: condition, limit, offset
    })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Product_types."
            });
        });
}
// Find a single Product_type with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Product_type.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Product_type with id=" + id
            });
        });
};
// Update a Product_type by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Product_type.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Product_type was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Product_type with id=${id}. Maybe Product_type was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Product_type with id=" + id
            });
        });
};
// Delete a Product_type with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Product_type.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Product_type was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Product_type with id=${id}. Maybe Product_type was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Product_type with id=" + id
            });
        });
};
// Delete all Product_types from the database.
exports.deleteAll = (req, res) => {
    Product_type.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Product_types were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Product_types."
            });
        });
};
// // Find all published Product_types
// exports.findAllPublished = (req, res) => {
//     Product_type.findAll({ where: { published: true } })
//     .then(data => {
//         res.send(data);
//     })
//     .catch(err => {
//         res.status(500).send({
//             message:
//             err.message || "Some error occurred while retrieving Product_types."
//         });
//     });
// };