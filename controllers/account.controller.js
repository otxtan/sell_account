const db = require("../models");
const Account = db.account;

const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");

// Create and Save a new Account
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a Account
    const account = {
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        active_key:req.body.active_key,
        status: req.body.status,
        SubscriptionPlanId: req.body.SubscriptionPlanId
        
    };
    // Save account in the database
    Account.create(account)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Account."
        });
    });
};
// Retrieve all Accounts from the database.
exports.findAll = (req, res) => {
    // const SubscriptionPlanId = req.query.SubscriptionPlanId;
    // var condition = SubscriptionPlanId ? { SubscriptionPlanId: { [Op.like]: `%${SubscriptionPlanId}%` } } : null;
    Account.findAll(
        // {
        //     include: [{// Notice `include` takes an ARRAY
        //       model: Category
        //     }]
        //   }
    )
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving Accounts."
        });
    });
};
// Retrieve by Paging
exports.findAllByPage = (req, res) => {
    const { page, size,SubscriptionPlanId } = req.query;
    var condition = SubscriptionPlanId ? { SubscriptionPlanId: { [Op.like]: `%${SubscriptionPlanId}%` } } : null;
    const { limit, offset } = getPagination(page, size);
    Account.findAndCountAll({ 
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
            err.message || "Some error occurred while retrieving Accounts."
        });
    });
}
// Find a single Account with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Account.findByPk(id)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message: "Error retrieving Account with id=" + id
        });
    });
};
// Update a Account by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Account.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "Account was updated successfully."
            });
        } else {
            res.send({
            message: `Cannot update Account with id=${id}. Maybe Account was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Account with id=" + id
        });
    });
};
// Delete a Account with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Account.destroy({
      where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "Account was deleted successfully!"
            });
        } else {
            res.send({
            message: `Cannot delete Account with id=${id}. Maybe Account was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Account with id=" + id
        });
    });
};
// Delete all Accounts from the database.
exports.deleteAll = (req, res) => {
    Account.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} Accounts were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while removing all Accounts."
        });
    });
};
// Find all published Accounts
// exports.findAllPublished = (req, res) => {
//     Account.findAll({ where: { published: true } })
//     .then(data => {
//         res.send(data);
//     })
//     .catch(err => {
//         res.status(500).send({
//             message:
//             err.message || "Some error occurred while retrieving Accounts."
//         });
//     });
// };