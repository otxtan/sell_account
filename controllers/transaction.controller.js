
const db = require("../models");
const { payment } = require("./cart.controller");
const Transaction = db.transaction;
const Op = db.Sequelize.Op;
const TransactionDetail = db.transaction_details;
const Account = db.account;
const { getPagination, getPagingData } = require("./utils");

// Create and Save a new Transaction
exports.create = async (req, res) => {
    try {
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
        const data = await Transaction.create(transaction);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Transaction."
        });
    }
};

// Retrieve all Transactions from the database.
exports.findAll = async (req, res) => {
    try {
        const title = req.query.title;
        var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
        const data = await Transaction.findAll({
            // include: [{// Notice `include` takes an ARRAY
            //   model: Category
            // }]
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Transactions."
        });
    }
};

// Retrieve by Paging
// exports.findAllByPage = async (req, res) => {
//     try {
//         const { page, size, title } = req.query;
//         var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
//         const { limit, offset } = getPagination(page, size);
//         const data = await Transaction.findAndCountAll({
//             // include: [{// Notice `include` takes an ARRAY
//             //     model: Category
//             //   }],
//             where: condition, limit, offset
//         });
//         const response = getPagingData(data, page, limit);
//         res.send(response);
//     } catch (err) {
//         res.status(500).send({
//             message: err.message || "Some error occurred while retrieving Transactions."
//         });
//     }
// };
exports.findAllByPage = async (req, res) => {
    try {
        const { page, size, transaction_status } = req.query;
        var condition = transaction_status ? { transaction_status: { [Op.like]: `%${transaction_status}%` } } : null;
        const { limit, offset } = getPagination(page, size);
        const data = await Transaction.findAndCountAll({
            // include: [{// Notice `include` takes an ARRAY
            //     model: Category
            //   }],
            where: condition, limit, offset,
            include: [
                {
                    model: db.payment_method
                },
                {
                    model: db.user
                }

            ]
        });
        const response = getPagingData(data, page, limit);
        res.send(response);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Transactions."
        });
    }
};
exports.findAllUByPageByUser = async (req, res) => {
    try {
        const { page, size, userid } = req.query;
        var condition = userid ? { UserId: { [Op.like]: `%${userid}%` } } : null;
        const { limit, offset } = getPagination(page, size);
        const data = await Transaction.findAndCountAll({
            // include: [{// Notice `include` takes an ARRAY
            //     model: Category
            //   }],
            where: condition, limit, offset
        });
        const response = getPagingData(data, page, limit);
        res.send(response);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Transactions."
        });
    }
};
// Find a single Transaction with an id
exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Transaction.findByPk(id);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving Transaction with id=" + id
        });
    }
};

// Update a Transaction by the id in the request
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const num = await Transaction.update(req.body, { where: { id: id } });
        if (num == 1) {
            res.send({
                message: "Transaction was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Transaction with id=${id}. Maybe Transaction was not found or req.body is empty!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error updating Transaction with id=" + id
        });
    }
};

// Delete a Transaction with the specified id in the request
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const num = await Transaction.destroy({ where: { id: id } });
        if (num == 1) {
            res.send({
                message: "Transaction was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Transaction with id=${id}. Maybe Transaction was not found!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Could not delete Transaction with id=" + id
        });
    }
};

// Delete all Transactions from the database.
exports.deleteAll = async (req, res) => {
    try {
        const nums = await Transaction.destroy({
            where: {},
            truncate: false
        });
        res.send({ message: `${nums} Transactions were deleted successfully!` });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while removing all Transactions."
        });
    }
};

// Find all published Transactions
// exports.findAllPublished = async (req, res) => {
//     try {
//         const data = await Transaction.findAll({ where: { published: true } });
//         res.send(data);
//     } catch (err) {
//         res.status(500).send({
//             message:
//             err.message || "Some error occurred while retrieving Transactions."
//         });
//     }
// };

exports.transactionResults = async (req, res) => {
    try {
        //  if(!req.query.TransactionId)
        //     return res.status(404).send('Giao dịch không tồn tại')
        const getTransaction = await Transaction.findOne(req.query.TransactionId);
        if (!getTransaction)
            return res.status(404).send('Giao dịch không tồn tại')
        if (getTransaction.transaction_status == 0) {
            //chưa thanh toán thanh toán thất bại
            return res.status(404).send('chưa thanh toán');
        }
        if (getTransaction.transaction_status == 1)
            // chờ thanh toán
            return res.send('thanh toán thành công');
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while processing payment."
        });
    }
};

exports.confirmPayment = async (req, res) => {
    try {

        const getTransaction = await Transaction.findByPk(req.params.id);
        if (!getTransaction)
            return res.status(404).send('Giao dịch không tồn tại');
        
        const num = await Transaction.update({ transaction_status: req.body.transaction_status },
            {
                where: {
                    id: req.params.id
                }
            });

        if (num == 1) {
            // add account vào transactiondetail
            const getTransactionDetail = await TransactionDetail.findAll({
                where: {
                    TransactionId: req.params.id
                }
            })
            console.log(getTransactionDetail)
            getTransactionDetail.forEach(async element => {
                let getAccount = await Account.findOne({
                    where: {
                        SubscriptionPlanId: element.SubscriptionPlanId,
                        status: false
                    }
                })
                await db.account.update({ status: true }, { where: { id: getAccount.id } })

                await TransactionDetail.update({ AccountId: getAccount.id }, { where: { id: element.id } });
                console.log(req.body)
            });
            return res.send( "Transaction was updated successfully." );
        } else {
            return res.send( `Cannot update Transaction with id. Maybe Transaction was not found or req.body is empty!` );
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while processing payment."
        });
    }
};
