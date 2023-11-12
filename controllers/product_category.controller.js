const db = require("../models");
const Product_category = db.category;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");

// Create and Save a new Product_category
exports.create = (req, res) => {
    // Validate request
    if (!req.body.product_category_name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a Product_category
    const productCategory = {
        product_category_name: req.body.product_category_name,
        
    };
    // Save Product_category in the database
    Product_category.create(productCategory)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Product_category."
        });
    });
};
// Retrieve all Product_categorys from the database.
exports.findAll = (req, res) => {
    const product_category_name = req.query.product_category_name;
    var condition = product_category_name ? { product_category_name: { [Op.like]: `%${product_category_name}%` } } : null;
    Product_category.findAll(
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
            err.message || "Some error occurred while retrieving Product_categorys."
        });
    });
};
// Retrieve by Paging
exports.findAllByPage = (req, res) => {
    const { page, size, product_category_name } = req.query;
    var condition = product_category_name ? { product_category_name: { [Op.like]: `%${product_category_name}%` } } : null;
    const { limit, offset } = getPagination(page, size);
    Product_category.findAndCountAll({ 
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
            err.message || "Some error occurred while retrieving Product_categorys."
        });
    });
}
// Find a single Product_category with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Product_category.findByPk(id)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message: "Error retrieving Product_category with id=" + id
        });
    });
};
// Update a Product_category by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Product_category.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "Product_category was updated successfully."
            });
        } else {
            res.send({
            message: `Cannot update Product_category with id=${id}. Maybe Product_category was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Product_category with id=" + id
        });
    });
};
// Delete a Product_category with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Product_category.destroy({
      where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "Product_category was deleted successfully!"
            });
        } else {
            res.send({
            message: `Cannot delete Product_category with id=${id}. Maybe Product_category was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Product_category with id=" + id
        });
    });
};
// Delete all Product_categorys from the database.
exports.deleteAll = (req, res) => {
    Product_category.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} Product_categorys were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while removing all Product_categorys."
        });
    });
};
// Find all published Product_categorys
// exports.findAllPublished = (req, res) => {
//     Product_category.findAll({ where: { published: true } })
//     .then(data => {
//         res.send(data);
//     })
//     .catch(err => {
//         res.status(500).send({
//             message:
//             err.message || "Some error occurred while retrieving Product_categorys."
//         });
//     });
// };