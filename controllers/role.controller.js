const db = require("../models");
const Role = db.role;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");

// Create and Save a new Role
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a Role
    const role = {
    };
    req.body.name?role.name= req.body.name:null;
    // Save Role in the database
    Role.create(role)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Role."
        });
    });
};
// Retrieve all Roles from the database.
exports.findAll = (req, res) => {
    // const title = req.query.title;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    Role.findAll(
      
    )
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving Roles."
        });
    });
};
// Retrieve by Paging
exports.findAllByPage = (req, res) => {
    const { page, size, title } = req.query;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    const { limit, offset } = getPagination(page, size);
    Role.findAndCountAll({ 
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
            err.message || "Some error occurred while retrieving Roles."
        });
    });
}
// Find a single Role with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Role.findByPk(id)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message: "Error retrieving Role with id=" + id
        });
    });
};
// Update a Role by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Role.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "Role was updated successfully."
            });
        } else {
            res.send({
            message: `Cannot update Role with id=${id}. Maybe Role was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Role with id=" + id
        });
    });
};
// Delete a Role with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Role.destroy({
      where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "Role was deleted successfully!"
            });
        } else {
            res.send({
            message: `Cannot delete Role with id=${id}. Maybe Role was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Role with id=" + id
        });
    });
};
// Delete all Roles from the database.
exports.deleteAll = (req, res) => {
    Role.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} Roles were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while removing all Roles."
        });
    });
};
// Find all published Roles
exports.findAllPublished = (req, res) => {
    Role.findAll({ where: { published: true } })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Roles."
        });
    });
};