const db = require("../models");
const Transaction = db.transaction;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");

// Create and Save a new Transaction
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a Transaction
    const transaction = {
        transaction_date: formattedDate,
        transaction_status: req.body.transaction_status,
        total_amount: req.body.total_amount,
        total_discount: req.body.total_discount,
        total_payment: req.body.total_payment,
        PaymentMethodld: req.body.PaymentMethodId,
        VoucherCode: req.body.voucher,
        Userld: req.body.UserId

    };
    // Save Transaction in the database
    Transaction.create(transaction)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Transaction."
            });
        });
};
// Retrieve all Transactions from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    Transaction.findAll(
        {
            // include: [{// Notice `include` takes an ARRAY
            //   model: Category
            // }]
        }
    )
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Transactions."
            });
        });
};
// Retrieve by Paging
exports.findAllByPage = (req, res) => {
    const { page, size, title } = req.query;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    const { limit, offset } = getPagination(page, size);
    Transaction.findAndCountAll({
        // include: [{// Notice `include` takes an ARRAY
        //     model: Category
        //   }],
        where: condition, limit, offset
    })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Transactions."
            });
        });
}
// Find a single Transaction with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Transaction.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Transaction with id=" + id
            });
        });
};
// Update a Transaction by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Transaction.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Transaction was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Transaction with id=${id}. Maybe Transaction was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Transaction with id=" + id
            });
        });
};
// Delete a Transaction with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Transaction.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Transaction was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Transaction with id=${id}. Maybe Transaction was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Transaction with id=" + id
            });
        });
};
// Delete all Transactions from the database.
exports.deleteAll = (req, res) => {
    Transaction.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Transactions were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Transactions."
            });
        });
};
// Find all published Transactions
// exports.findAllPublished = (req, res) => {
//     Transaction.findAll({ where: { published: true } })
//     .then(data => {
//         res.send(data);
//     })
//     .catch(err => {
//         res.status(500).send({
//             message:
//             err.message || "Some error occurred while retrieving Transactions."
//         });
//     });
// };
exports.confirmPayment = (req, res) => {
    try {
        

    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while processing payment."
        });
    }
}