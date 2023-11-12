const db = require("../models");
const Product = db.product;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");

// Create and Save a new Product
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a Product
    const product = {
        name: req.body.name,
        description: req.body.description,
        content: req.body.content,
        image:req.body.image,
        thumbnail:req.body.thumbnail,
        published: req.body.published,
        ProductCategoryId: req.body.ProductCategoryId,
        ProductTypeId: req.body.ProductTypeId
        
    };
    // Save Product in the database
    Product.create(product)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Product."
        });
    });
};
// Retrieve all Products from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    Product.findAll(
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
            err.message || "Some error occurred while retrieving Products."
        });
    });
};
// Retrieve by Paging
exports.findAllByPage = (req, res) => {
    const { page, size, name } = req.query;
    
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    const { limit, offset } = getPagination(page, size);
    Product.findAndCountAll({ 
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
            err.message || "Some error occurred while retrieving Products."
        });
    });
}
// Find a single Product with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Product.findByPk(id)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message: "Error retrieving Product with id=" + id
        });
    });
};
// Update a Product by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Product.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "Product was updated successfully."
            });
        } else {
            res.send({
            message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Product with id=" + id 
        });
    });
};
// Delete a Product with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Product.destroy({
      where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "Product was deleted successfully!"
            });
        } else {
            res.send({
            message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Product with id=" + id
        });
    });
};
// Delete all Products from the database.
exports.deleteAll = (req, res) => {
    Product.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} Products were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while removing all Products."
        });
    });
};
// Find all published Products
exports.findAllPublished = (req, res) => {
    Product.findAll({ where: { published: true } })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Products."
        });
    });
};