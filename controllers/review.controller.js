const db = require("../models");
const Reivew = db.review;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");

// Create and Save a new Reivew
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a Reivew
    const review = {
        vote:req.body.vote, 
        review_content: req.body.review_content,
        review_posting_date:req.body.review_posting_date,
        review_published: req.body.review_published,
        TransactionDetailId: req.body.TransactionDetailId
        
    };
    // Save Reivew in the database
    Reivew.create(review)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Reivew."
        });
    });
};
// Retrieve all Reivews from the database.
exports.findAll = (req, res) => {
    const ProductId = req.query.ProductId;
    var condition = ProductId ? { ProductId: { [Op.like]: `%${ProductId}%` } } : null;
    Reivew.findAll(
        {
            // include: [{// Notice `include` takes an ARRAY
            //   model: Category
            // }]
            where: condition
          }
    )
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving Reivews."
        });
    });
};
// Retrieve by Paging
exports.findAllByPage = (req, res) => {
    const { page, size, ProductId } = req.query;
    var condition = ProductId ? { ProductId: { [Op.like]: `%${ProductId}%` } } : null;
    const { limit, offset } = getPagination(page, size);
    Reivew.findAndCountAll({ 
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
            err.message || "Some error occurred while retrieving Reivews."
        });
    });
}
// Find a single Reivew with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Reivew.findByPk(id)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message: "Error retrieving Reivew with id=" + id
        });
    });
};
// Update a Reivew by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Reivew.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "Reivew was updated successfully."
            });
        } else {
            res.send({
            message: `Cannot update Reivew with id=${id}. Maybe Reivew was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Reivew with id=" + id
        });
    });
};
// Delete a Reivew with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Reivew.destroy({
      where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "Reivew was deleted successfully!"
            });
        } else {
            res.send({
            message: `Cannot delete Reivew with id=${id}. Maybe Reivew was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Reivew with id=" + id
        });
    });
};
// Delete all Reivews from the database.
exports.deleteAll = (req, res) => {
    Reivew.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} Reivews were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while removing all Reivews."
        });
    });
};
// Find all published Reivews
exports.findAllPublished = (req, res) => {
    Reivew.findAll({ where: { review_published: true } })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Reivews."
        });
    });
};