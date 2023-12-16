const db = require("../models");
const Account = db.account;

const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");

// Create and Save a new Account
exports.create = async (req, res) => {
    try {
        // Validate request
        if (!req.body) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
            return;
        }

        // Create a Account
        const account = {};
        req.body.status ? (account.status = parseInt(req.body.status)) : 0;
        req.body.SubscriptionPlanId ? (account.SubscriptionPlanId = parseInt(req.body.SubscriptionPlanId)) : null;
        req.body.information ? (account.information = req.body.information) : account.information = '';
        console.log(account)

        // Save account in the database
        if (!account?.SubscriptionPlanId || !account?.information) 
            return res.send('please select value')
        console.log(account)
        var dataArray = [];
        if (account?.information) {
            dataArray = (account.information).split('\n');
            console.log(dataArray)
        }
        console.log(dataArray.length)
        if (dataArray.length > 0) {
            const totalAccount=await Account.count({where:{
                status: 0,
                SubscriptionPlanId: account.SubscriptionPlanId
            }})
            console.log(totalAccount)
            dataArray.forEach(async data => {
                account.information = data;
                await Account.create(account);
            });
            db.subscription_plan.update({total:(dataArray.length+totalAccount)},{
                where:{
                    id: account.SubscriptionPlanId
                }
            })
            
            return res.send('Added account');
        }
        return res.send('');

        // const data = await Account.create(account);
        
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Account."
        });
    }
};

// Retrieve all Accounts from the database.
exports.findAll = async (req, res) => {
    try {
        const data = await Account.findAll({

        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Accounts."
        });
    }
};

// Retrieve by Paging
exports.findAllByPage = async (req, res) => {
    try {
        const { page, size, SubscriptionPlanId } = req.query;
        const condition = SubscriptionPlanId ? { SubscriptionPlanId: { [Op.like]: `%${SubscriptionPlanId}%` } } : null;
        const { limit, offset } = getPagination(page, size);
        const data = await Account.findAndCountAll({ where: condition, limit, offset });
        const response = getPagingData(data, page, limit);
        res.send(response);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Accounts."
        });
    }
};
exports.findAllAccountSubscriptonplanProductByPage = async (req, res) => {
    try {
        const { page, size, information } = req.query;
        const condition = information ? { information: { [Op.like]: `%${information}%` } } : '';
        const { limit, offset } = getPagination(page, size);

        const queryOptions = {
            where: condition,
            limit,
            offset,
            include: [
                {
                    model: db.subscription_plan,
                    attributes: ['id', 'packed_name'],
                    as: 'Subscription_plan',
                    include: [
                        {
                            model: db.product
                        }
                    ]
                }
            ],
        };

        const data = await Account.findAndCountAll(queryOptions);
        const response = getPagingData(data, page, limit);
        res.send(response);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Accounts."
        });
    }
};

// Find a single Account with an id
exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Account.findByPk(id);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving Account with id=" + id
        });
    }
};

// Update a Account by the id in the request
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const account = {};
        req.body.status ? (account.status = parseInt(req.body.status)) : null;
        req.body.information ? (account.information = req.body.information) : account.information = '';
        const num = await Account.update(account, {
            where: { id: id }
        });

        if (num == 1) {
            res.send({
                message: "Account was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Account with id=${id}. Maybe Account was not found or req.body is empty!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error updating Account with id=" + id
        });
    }
};

// Delete a Account with the specified id in the request
exports.delete = async (req, res) => {
    try {
        if(!req.params.id)
            return res.send('id invalid');
        
        const account = await Account.findByPk(req.params.id);
        if(account.status>0)
            return res.send('id invalid');
        const totalAccount=await db.subscription_plan.count({
            where:{
                id: account.SubscriptionPlanId
            }
        })
        await db.subscription_plan.update({total:(totalAccount-1)},{
            where:{
                id: account.SubscriptionPlanId
            }
        })
        const num = await Account.destroy({
            where: { id: req.params.id }

        });

        if (num == 1) {
            res.send({
                message: "Account was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Account with id=${req.params.id}. Maybe Account was not found!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Could not delete Account with id=" + req.params.id
        });
    }
};

// Delete all Accounts from the database.
exports.deleteAll = async (req, res) => {
    try {
        const nums = await Account.destroy({
            where: {},
            truncate: false
        });

        res.send({ message: `${nums} Accounts were deleted successfully!` });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while removing all Accounts."
        });
    }
};
