const db = require("../models");
const Customer = db.customer;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");
const saltRounds = 10;
const bcrypt = require("bcryptjs");
// Create and Save a new Customer
exports.create = async (req, res) => {
    try {
        // Validate request
        if (!req.body.title) {
            return res.status(400).send({
                message: "Content can not be empty!"
            });
        }

        // Create a Customer
        const customer = {
            full_name: req.body.full_name,
            address: req.body.address,
            phone_number: req.body.phone_number,
            email_address: req.body.email_address,
        };

        // Save Customer in the database
        const data = await Customer.create(customer);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the Customer."
        });
    }
};

// Retrieve all Customers from the database.
exports.findAll = async (req, res) => {
    try {
        const title = req.query.title;
        const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
        const data = await Customer.findAll({
            include: [
                {
                    model: Category
                }
            ],
            where: condition,
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Customers."
        });
    }
};

// Retrieve by Paging
exports.findAllByPage = async (req, res) => {
    try {
        const { page, size, title } = req.query;
        const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
        const { limit, offset } = getPagination(page, size);
        const data = await Customer.findAndCountAll({ where: condition, limit, offset });
        const response = getPagingData(data, page, limit);
        res.send(response);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Customers."
        });
    }
};

// Find a single Customer with an id
exports.findAllCustomerUserRoleByPage = async (req, res) => {
    try {
        const { page, size, email } = req.query;
        let whereCondition = {

        };

        console.log("noi dung")
        if (email != null && email != 'undefined') {
            whereCondition.email_address = { [Op.like]: `%${email}%` };
        }
        console.log(email)
        const { limit, offset } = getPagination(page, size);
        const data = await Customer.findAndCountAll({
            include: [
                {
                    model: db.user,
                    include: [
                        {
                            model: db.role
                        }
                    ]
                }
            ],
            where: whereCondition,
            limit,
            offset
        });

        const response = getPagingData(data, page, limit);
        res.send(response);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Customers."
        });
    }
};

// Find a single Customer with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Customer.findByPk(id);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving Customer with id=" + id
        });
    }
};
exports.findOneCMS = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(req.params)
        const data = await Customer.findOne(
            {
                where: {
                    id: id
                },
                include: [
                    {
                        model: db.user,
                        include: [
                            {
                                model: db.role
                            }
                        ]
                    }
                ],
            },
        );
        console.log(data)
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving Customer with id=" + id
        });
    }
};
exports.updateCustomer = async (req, res) => {

    try {
        const customerId = req.params.id;
        console.log(customerId)
        const findOneCustomer = await Customer.findByPk(customerId);
        if (!findOneCustomer) {
            return res.send('khong ton tai customer')
        }
        const user = {
        };
        req.body.username ? (user.username = req.body.username) : null;
        req.body.roleId ? (user.roleId = parseInt(req.body.roleId)) : null;
        req.body.status ? (user.status = parseInt(req.body.status)) : null;

        const customer = {

            // UserId: 0,
        };
        req.body.full_name ? customer.full_name = req.body.full_name : null;
        req.body.address ? customer.address = req.body.address : null;
        req.body.phone_number ? customer.phone_number = req.body.phone_number : null;
        req.body.email_address ? customer.email_address = req.body.email_address : null;
        console.log( req.body)
        if (req.body.password&&req.body.password!='') {
            user.password = req.body.password;
            const salt = await bcrypt.genSalt(saltRounds);
            user.salt = salt;
            console.log(user.password)
            console.log(await bcrypt.hash(user.password, salt))
            const hash = await bcrypt.hash(user.password, salt);
            user.password = hash;
        }
        await db.user.update(user, { where: { id: findOneCustomer.UserId } });


        await Customer.update(customer, { where: { id: customerId } });

        res.send({
            message: "Customer was updated successfully."
        });

    } catch (err) {
        // res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while creating the Customer.",
        // });
        console.log(err.message)
        res.send(err.message)
    }
}

// Update a Customer by the id in the request
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const num = await Customer.update(req.body, { where: { id: id } });

        if (num == 1) {
            res.send({
                message: "Customer was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Customer with id=${id}. Maybe Customer was not found or req.body is empty!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error updating Customer with id=" + id
        });
    }
};

// Delete a Customer with the specified id in the request
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const num = await Customer.destroy({ where: { id: id } });

        if (num == 1) {
            res.send({
                message: "Customer was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Customer with id=${id}. Maybe Customer was not found!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Could not delete Customer with id=" + id
        });
    }
};

// Delete all Customers from the database.
exports.deleteAll = async (req, res) => {
    try {
        const nums = await Customer.destroy({ where: {}, truncate: false });
        res.send({ message: `${nums} Customers were deleted successfully!` });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while removing all Customers."
        });
    }
};

// Find all published Customers
exports.findAllPublished = async (req, res) => {
    try {
        const data = await Customer.findAll({ where: { published: true } });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Customers."
        });
    }
};
