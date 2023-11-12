const db = require("../models");

const VoucherProduct = db.voucherProduct;
const Voucher=db.voucher;
const Product=db.product;
const VoucherCategory=db.voucherCategory;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");

// Create and Save a new VoucherProduct
exports.create = async (req, res) => {
    try {
        // Validate request
        if (!req.body) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
            return;
        }
        // Create a VoucherProduct
        const voucher_product = {
            VoucherCode: req.body.VoucherCode,
            ProductId: req.body.ProductId ,
            
        };
        const getVoucherCategory=await VoucherCategory.findOne({
            where:{
                VoucherCode: req.body.VoucherCode
            }
        })
        console.log(getVoucherCategory)
        if(getVoucherCategory)
            return res.send('Voucher đã tồn tại bên VoucherCategory');
        const voucher = await Voucher.findByPk(voucher_product.VoucherCode);
        const product = await Product.findByPk(voucher_product.ProductId);
        
        console.log(voucher_product);
        createVoucherProduct=await voucher.addProducts(product);
        // Save VoucherProduct in the database
        // const data = await VoucherProduct.create(voucher_product_category);
        res.send(createVoucherProduct);
    } catch (err) {
        res.status(500).send({
            message:  "Some error occurred while creating the VoucherProduct."
        });
    }
};

// Retrieve all VoucherProducts from the database.
exports.findAll = async (req, res) => {
    try {
        const data = await VoucherProduct.findAll();
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving VoucherProducts."
        });
    }
};

// Retrieve by Paging
exports.findAllByPage = async (req, res) => {
    try {
        const { page, size, SubscriptionPlanId } = req.query;
        const condition = SubscriptionPlanId ? { SubscriptionPlanId: { [Op.like]: `%${SubscriptionPlanId}%` } } : null;
        const { limit, offset } = getPagination(page, size);
        const data = await VoucherProduct.findAndCountAll({
            where: condition,
            limit,
            offset
        });
        const response = getPagingData(data, page, limit);
        res.send(response);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving VoucherProducts."
        });
    }
};

// Find a single VoucherProduct with an id
exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await VoucherProduct.findByPk(id);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving VoucherProduct with id=" + id
        });
    }
};

// Update a VoucherProduct by the id in the request
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const [num] = await VoucherProduct.update(req.body, {
            where: { id: id }
        });
        if (num === 1) {
            res.send({
                message: "VoucherProduct was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update VoucherProduct with id=${id}. Maybe VoucherProduct was not found or req.body is empty!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error updating VoucherProduct with id=" + id
        });
    }
};

// Delete a VoucherProduct with the specified id in the request
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const num = await VoucherProduct.destroy({
            where: { id: id }
        });
        if (num === 1) {
            res.send({
                message: "VoucherProduct was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete VoucherProduct with id=${id}. Maybe VoucherProduct was not found!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Could not delete VoucherProduct with id=" + id
        });
    }
};

// Delete all VoucherProducts from the database.
exports.deleteAll = async (req, res) => {
    try {
        const num = await VoucherProduct.destroy({
            where: {},
            truncate: false
        });
        res.send({
            message: `${num} VoucherProducts were deleted successfully!`
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while removing all VoucherProducts."
        });
    }
};
