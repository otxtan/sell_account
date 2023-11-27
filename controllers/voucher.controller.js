const db = require("../models");
const Voucher = db.voucher;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");

// Create and Save a new Voucher
exports.create = async (req, res) => {
    try {
        if (!req.body.discount_amount && !req.body.discount_percentage && !req.body.min_order_amount && !req.body.start_date && !req.body.end_date && !req.body.is_fixed_discount && !req.body.quality && !req.body.total) {
            return res.status(400).send({
                message: "Content can not be empty!"
            });
        }

        function genCode() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let voucherCode = '';

            for (let i = 0; i < 10; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                voucherCode += characters[randomIndex];
            }

            return voucherCode;
        }

        const voucher = {
            code: req.body.code ? req.body.code : genCode(),
            discount_amount: req.body.discount_amount,
            discount_percentage: req.body.discount_percentage,
            min_order_amount: req.body.min_order_amount,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            is_fixed_discount: req.body.is_fixed_discount,
            quantity: req.body.quatity, // Đây có vẻ là một lỗi chính tả, bạn có thể muốn sửa thành 'quantity'
            total: req.body.total
        };

        console.log('code', genCode());

        const data = await Voucher.create(voucher);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Voucher."
        });
    }
};

// Retrieve all Vouchers from the database.
exports.findAll = async (req, res) => {
    try {
        const date = req.query.start_date;
        const condition = date ? { date: { [Op.like]: `%${date}%` } } : null;
        const data = await Voucher.findAll({ where: condition });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Vouchers."
        });
    }
};

// Retrieve by Paging
exports.findAllByPage = async (req, res) => {
    try {
        const { page, size, start_date } = req.query;
        const condition = start_date ? { start_date: { [Op.like]: `%${start_date}%` } } : null;
        const { limit, offset } = getPagination(page, size);
        const data = await Voucher.findAndCountAll({ where: condition, limit, offset });
        const response = getPagingData(data, page, limit);
        res.send(response);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Vouchers."
        });
    }
};

// Find a single Voucher with a code
exports.findOne = async (req, res) => {
    try {
        const code = req.params.code;
        const data = await Voucher.findByPk(code);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving Voucher with code=" + code
        });
    }
};

// Update a Voucher by the code in the request
exports.update = async (req, res) => {
    try {
        const code = req.params.code;
        const num = await Voucher.update(req.body, { where: { code: code } });

        if (num == 1) {
            res.send({
                message: "Voucher was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Voucher with code=${code}. Maybe Voucher was not found or req.body is empty!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error updating Voucher with code=" + code
        });
    }
};

// Delete a Voucher with the specified code in the request
exports.delete = async (req, res) => {
    try {
        const code = req.params.code;
        const num = await Voucher.destroy({ where: { code: code } });

        if (num == 1) {
            res.send({
                message: "Voucher was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Voucher with code=${code}. Maybe Voucher was not found!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Could not delete Voucher with code=" + code
        });
    }
};

// Delete all Vouchers from the database.
exports.deleteAll = async (req, res) => {
    try {
        const nums = await Voucher.destroy({ where: {}, truncate: false });
        res.send({ message: `${nums} Vouchers were deleted successfully!` });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while removing all Vouchers."
        });
    }
};

// Find all published Vouchers
exports.findAllFixedDiscount = async (req, res) => {
    try {
        const data = await Voucher.findAll({ where: { is_fixed_discount: true } });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Vouchers."
        });
    }
};

exports.findAllbyProductCategory = async (req, res) => {
    try {

        console.log( 'valuee'+req.body)
        const productIds = req.body.product.map(item => item.Subscription_plan.Product.id);

        
        const categoryIds = req.body.product.map(item => item.Subscription_plan.Product.ProductCategoryId);
        
        const vouchersProduct = await Voucher.findAll({
            include: [
                {
                    model: db.product,
                    where: { id: productIds },
                    through: {
                        model: db.voucherProduct,
                    },
                },
            ],

        });

        
        const vouchersCategory = await Voucher.findAll({
            include: [
                {
                    model: db.category,
                    where: { id: categoryIds },
                    through:{
                        model:db.voucherCategory,
                    }
                },
            ],
        });
        const uniqueVouchers = [...vouchersProduct, ...vouchersCategory]
        
        console.log(uniqueVouchers)
        res.send(uniqueVouchers);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Vouchers."
        });
    }
};
