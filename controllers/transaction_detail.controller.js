const db = require("../models");
const Transaction_detail = db.transaction_details;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");

// Create and Save a new Transaction_detail
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a Transaction_detail
    const transactionDetail = {
        quantity: req.body.quantity,
        price_per_unit: req.body.price_per_unit,
        total: req.body.total,
        transaction_date: req.body.transaction_date,
        VoucherCode: req.body.VoucherCode,
        AccountId: req.body.AccountId,
        TransactionId: req.body.TransactionId
        
    };
    // Save Transaction_detail in the database
    Transaction_detail.create(transactionDetail)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Transaction_detail."
        });
    });
};
// Retrieve all Transaction_details from the database.
exports.findAll = (req, res) => {
    const TransactionId = req.query.TransactionId;
    var condition = TransactionId ? { TransactionId: { [Op.like]: `%${TransactionId}%` } } : null;
    Transaction_detail.findAll(
        {
            // include: [{// Notice `include` takes an ARRAY
            //   model: Category
            // }]
            where:condition
          }
    )
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving Transaction_details."
        });
    });
};
// Retrieve by Paging
exports.findAllByPage = (req, res) => {
    const { page, size, TransactionId } = req.query;
    var condition = TransactionId ? { TransactionId: { [Op.like]: `%${TransactionId}%` } } : null;
    const { limit, offset } = getPagination(page, size);
    Transaction_detail.findAndCountAll({ 
        // include: [{// Notice `include` takes an ARRAY
        //     model: Category
        //   }],
        where: condition, limit, offset })
    .then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Transaction_details."
        });
    });
}
// Find a single Transaction_detail with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Transaction_detail.findByPk(id)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message: "Error retrieving Transaction_detail with id=" + id
        });
    });
};
// Update a Transaction_detail by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Transaction_detail.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "Transaction_detail was updated successfully."
            });
        } else {
            res.send({
            message: `Cannot update Transaction_detail with id=${id}. Maybe Transaction_detail was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Transaction_detail with id=" + id
        });
    });
};
// Delete a Transaction_detail with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Transaction_detail.destroy({
      where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "Transaction_detail was deleted successfully!"
            });
        } else {
            res.send({
            message: `Cannot delete Transaction_detail with id=${id}. Maybe Transaction_detail was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Transaction_detail with id=" + id
        });
    });
};
// Delete all Transaction_details from the database.
exports.deleteAll = (req, res) => {
    Transaction_detail.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} Transaction_details were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while removing all Transaction_details."
        });
    });
};
// Find all published Transaction_details
exports.findAllPublished = (req, res) => {
    Transaction_detail.findAll({ where: { published: true } })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Transaction_details."
        });
    });
};