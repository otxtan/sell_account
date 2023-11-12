const db = require("../models");
const Voucher = db.voucher;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");

// Create and Save a new Voucher
exports.create = (req, res) => {
    // Valcodeate request
    if (!req.body.discount_amount && !req.body.discount_percentage && !req.body.min_order_amount && !req.body.start_date && !req.body.end_date && !req.body.is_fixed_discount && !req.body.quality&& !req.body.total) {
        return res.status(400).send({
            message: "Content can not be empty!"
        });
        
        
    }
    // Create a Voucher
    function genCode(){
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Các ký tự được sử dụng trong mã voucher
        let voucherCode = '';

        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            voucherCode+=characters[randomIndex];
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
        quantity: req.body.quatity,
        total: req.body.total
        
    };
    console.log('code',genCode());
    // Save Voucher in the database
    Voucher.create(voucher)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Voucher."
            });
        });
};
// Retrieve all Vouchers from the database.
exports.findAll = (req, res) => {
    const date = req.query.start_date;
    var condition = date ? { date: { [Op.like]: `%${date}%` } } : null;
    Voucher.findAll(
        {
            // include: [{// Notice `include` takes an ARRAY
            //     model: Category
            // }]
            
        }
    )
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Vouchers."
            });
        });
};
// Retrieve by Paging
exports.findAllByPage = (req, res) => {
    const { page, size, start_date } = req.query;
    var condition = start_date ? { start_date: { [Op.like]: `%${start_date}%` } } : null;
    const { limit, offset } = getPagination(page, size);
    Voucher.findAndCountAll({
        // include: [{// Notice `include` takes an ARRAY
        //     model: Category
        // }],
        where: condition, limit, offset
    })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Vouchers."
            });
        });
}
// Find a single Voucher with an code
exports.findOne = (req, res) => {
    const code = req.params.code;
    Voucher.findByPk(code)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Voucher with code=" + code
            });
        });
};
// Update a Voucher by the code in the request
exports.update = (req, res) => {
    const code = req.params.code;
    Voucher.update(req.body, {
        where: { code: code }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Voucher was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Voucher with code=${code}. Maybe Voucher was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Voucher with code=" + code
            });
        });
};
// Delete a Voucher with the specified code in the request
exports.delete = (req, res) => {
    const code = req.params.code;
    Voucher.destroy({
        where: { code: code }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Voucher was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Voucher with code=${code}. Maybe Voucher was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Voucher with code=" + code
            });
        });
};
// Delete all Vouchers from the database.
exports.deleteAll = (req, res) => {
    Voucher.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Vouchers were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Vouchers."
            });
        });
};
// Find all published Vouchers
exports.findAllFixedDiscount = (req, res) => {
    Voucher.findAll({ where: { is_fixed_discount: true } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Vouchers."
            });
        });
};