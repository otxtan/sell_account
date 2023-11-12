const db = require("../models");
const Subscription_plan = db.subscription_plan;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");

// Create and Save a new Subscription_plan
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a Subscription_plan
    const subscriptionPlan = {
        packed_name:req.body.packed_name,
        total: req.body.total,
        quantity_sold: req.body.quantity_sold,
        duration: req.body.duration,
        discount_percentage: req.body.discount_percentage,
        price: req.body.price,
        ProductId: req.body.ProductId
        
    };
    // Save Subscription_plan in the database
    Subscription_plan.create(subscriptionPlan)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Subscription_plan."
        });
    });
};
// Retrieve all Subscription_plans from the database.
exports.findAll = (req, res) => {
    const ProductId = req.query.ProductId;
    var condition = ProductId ? { ProductId: { [Op.like]: `%${ProductId}%` } } : null;
    Subscription_plan.findAll(
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
            err.message || "Some error occurred while retrieving Subscription_plans."
        });
    });
};
// Retrieve by Paging
exports.findAllByPage = (req, res) => {
    const { page, size, ProductId } = req.query;
    var condition = ProductId ? { ProductId: { [Op.like]: `%${ProductId}%` } } : null;
    const { limit, offset } = getPagination(page, size);
    Subscription_plan.findAndCountAll({ 
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
            err.message || "Some error occurred while retrieving Subscription_plans."
        });
    });
}
// Find a single Subscription_plan with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Subscription_plan.findByPk(id)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message: "Error retrieving Subscription_plan with id=" + id
        });
    });
};
// Update a Subscription_plan by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Subscription_plan.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "Subscription_plan was updated successfully."
            });
        } else {
            res.send({
            message: `Cannot update Subscription_plan with id=${id}. Maybe Subscription_plan was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Subscription_plan with id=" + id
        });
    });
};
// Delete a Subscription_plan with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Subscription_plan.destroy({
      where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "Subscription_plan was deleted successfully!"
            });
        } else {
            res.send({
            message: `Cannot delete Subscription_plan with id=${id}. Maybe Subscription_plan was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Subscription_plan with id=" + id
        });
    });
};
// Delete all Subscription_plans from the database.
exports.deleteAll = (req, res) => {
    Subscription_plan.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} Subscription_plans were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while removing all Subscription_plans."
        });
    });
};
// Find all published Subscription_plans
// exports.findAllPublished = (req, res) => {
//     Subscription_plan.findAll({ where: { published: true } })
//     .then(data => {
//         res.send(data);
//     })
//     .catch(err => {
//         res.status(500).send({
//             message:
//             err.message || "Some error occurred while retrieving Subscription_plans."
//         });
//     });
// };