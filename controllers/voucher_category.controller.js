const db = require("../models");

const VoucherCategory = db.voucherCategory;
const Voucher=db.voucher;
const Product_category=db.category;
const VoucherProduct=db.voucherProduct;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");


// Create and Save a new VoucherCategory
exports.create = async (req, res) => {
    try {
        // Validate request
        if (!req.body) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
            return;
        }
        // Create a VoucherCategory
        
        const voucher_category = {
            VoucherCode: req.body.VoucherCode,
            ProductCategoryId: req.body.ProductCategoryId 
        };
        const getVoucherProduct=await VoucherProduct.findOne({
            where:{
                VoucherCode:req.body.VoucherCode
            }
        })
        console.log(getVoucherProduct)
        if(getVoucherProduct){
            return res.send('Voucher đã tồn tại bên VoucherProduct');
        }
        const voucher = await Voucher.findByPk(voucher_category.VoucherCode);
        const category = await Product_category.findByPk(voucher_category.ProductCategoryId);
        console.log(voucher);
        createVoucherCategory=await voucher.addProduct_categories(category);
        // Save VoucherCategory in the database
        // const data = await VoucherCategory.create(voucher_category);
        res.send(createVoucherCategory);
    } catch (err) {
        res.status(500).send({
            message: "Some error occurred while creating the VoucherCategory."
        });
    }
};

// Retrieve all VoucherCategorys from the database.
exports.findAll = async (req, res) => {
    try {
        const data = await VoucherCategory.findAll();
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving VoucherCategorys."
        });
    }
};

// Retrieve by Paging
exports.findAllByPage = async (req, res) => {
    try {
        const { page, size, SubscriptionPlanId } = req.query;
        const condition = SubscriptionPlanId ? { SubscriptionPlanId: { [Op.like]: `%${SubscriptionPlanId}%` } } : null;
        const { limit, offset } = getPagination(page, size);
        const data = await VoucherCategory.findAndCountAll({
            where: condition,
            limit,
            offset
        });
        const response = getPagingData(data, page, limit);
        res.send(response);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving VoucherCategorys."
        });
    }
};

// Find a single VoucherCategory with an id
exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await VoucherCategory.findByPk(id);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving VoucherCategory with id=" + id
        });
    }
};

// Update a VoucherCategory by the id in the request
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const [num] = await VoucherCategory.update(req.body, {
            where: { id: id }
        });
        if (num === 1) {
            res.send({
                message: "VoucherCategory was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update VoucherCategory with id=${id}. Maybe VoucherCategory was not found or req.body is empty!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error updating VoucherCategory with id=" + id
        });
    }
};

// Delete a VoucherCategory with the specified id in the request
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const num = await VoucherCategory.destroy({
            where: { id: id }
        });
        if (num === 1) {
            res.send({
                message: "VoucherCategory was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete VoucherCategory with id=${id}. Maybe VoucherCategory was not found!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Could not delete VoucherCategory with id=" + id
        });
    }
};

// Delete all VoucherCategorys from the database.
exports.deleteAll = async (req, res) => {
    try {
        const num = await VoucherCategory.destroy({
            where: {},
            truncate: false
        });
        res.send({
            message: `${num} VoucherCategorys were deleted successfully!`
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while removing all VoucherCategorys."
        });
    }
};
