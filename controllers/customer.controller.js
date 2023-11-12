const db = require("../models");
const Customer = db.customer;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");

// Create and Save a new Customer
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a Customer
    const customer = {
        full_name: req.body.full_name,
        address:req.body.address,
        phone_number:req.body.phone_number,
        email_address: req.body.email_address,
        // UserId: req.body.userId
        
    };
    // Save Customer in the database
    Customer.create(customer)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Customer."
        });
    });
};
// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    Customer.findAll(
        {
            include: [{// Notice `include` takes an ARRAY
              model: Category
            }]
          }
    )
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving Customers."
        });
    });
};
// Retrieve by Paging
exports.findAllByPage = (req, res) => {
    const { page, size, title } = req.query;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    const { limit, offset } = getPagination(page, size);
    Customer.findAndCountAll({ 
        include: [{// Notice `include` takes an ARRAY
            model: Category
          }],
        where: condition, limit, offset })
    .then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Customers."
        });
    });
}
// Find a single Customer with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Customer.findByPk(id)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message: "Error retrieving Customer with id=" + id
        });
    });
};
// Update a Customer by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Customer.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "Customer was updated successfully."
            });
        } else {
            res.send({
            message: `Cannot update Customer with id=${id}. Maybe Customer was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Customer with id=" + id
        });
    });
};
// Delete a Customer with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Customer.destroy({
      where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "Customer was deleted successfully!"
            });
        } else {
            res.send({
            message: `Cannot delete Customer with id=${id}. Maybe Customer was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Customer with id=" + id
        });
    });
};
// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
    Customer.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} Customers were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while removing all Customers."
        });
    });
};
// Find all published Customers
exports.findAllPublished = (req, res) => {
    Customer.findAll({ where: { published: true } })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Customers."
        });
    });
};