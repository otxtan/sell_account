const db = require("../models");
const Payment_method = db.payment_method;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");

// Create and Save a new Payment_method
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a Payment_method
    const paymentMethod = {
        Payment_name: req.body.Payment_name,
        Content: req.body.Content,

    };
    // Save Payment_method in the database
    Payment_method.create(paymentMethod)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Payment_method."
            });
        });
};
// Retrieve all Payment_methods from the database.
exports.findAll = (req, res) => {
    // const title = req.query.title;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    Payment_method.findAll(
        {
            // include: [{// Notice `include` takes an ARRAY
            //     model: Category
            // }]
        }
    )
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Payment_methods."
            });
        });
};
// Retrieve by Paging
exports.findAllByPage = (req, res) => {
    const { page, size } = req.query;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    const { limit, offset } = getPagination(page, size);
    Payment_method.findAndCountAll({
        // include: [{// Notice `include` takes an ARRAY
        //     model: Category
        // }],
        where: limit, offset
    })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Payment_methods."
            });
        });
}
// Find a single Payment_method with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Payment_method.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Payment_method with id=" + id
            });
        });
};
// Update a Payment_method by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Payment_method.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Payment_method was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Payment_method with id=${id}. Maybe Payment_method was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Payment_method with id=" + id
            });
        });
};
// Delete a Payment_method with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Payment_method.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Payment_method was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Payment_method with id=${id}. Maybe Payment_method was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Payment_method with id=" + id
            });
        });
};
// Delete all Payment_methods from the database.
exports.deleteAll = (req, res) => {
    Payment_method.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Payment_methods were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Payment_methods."
            });
        });
};
// Find all published Payment_methods
// exports.findAllPublished = (req, res) => {
//     Payment_method.findAll({ where: { published: true } })
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while retrieving Payment_methods."
//             });
//         });
// };