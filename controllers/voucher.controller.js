const db = require("../models");
const Voucher = db.voucher;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");

// Create and Save a new Voucher
exports.create = async (req, res) => {
    try {
        if (!req.body) {
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
        };

        const {
            code,
            discount_amount,
            discount_percentage,
            minimize,
            start_date,
            end_date,
            is_fixed_discount,
            quantity,
            total,
            min_order_amount,
            products,
            categories

        } = req.body;
        code ? voucher.code = code : (voucher.code = genCode());
        discount_amount ? voucher.discount_amount = discount_amount : null;
        discount_percentage ? voucher.discount_percentage = discount_percentage : null;
        minimize ? voucher.minimize = minimize : null;
        start_date ? voucher.start_date = start_date : null;
        end_date ? voucher.end_date = end_date : null;
        is_fixed_discount ? voucher.is_fixed_discount = is_fixed_discount : null;
        quantity ? voucher.quantity = quantity : 0;
        total ? voucher.total = total : null;
        min_order_amount ? voucher.min_order_amount = min_order_amount : null;
        const createVoucher = await Voucher.create(voucher);
        console.log(req.body)
        if (products?.length > 0) {
            products.forEach(async item => {
                const getVoucherCategory = await db.voucherCategory.findOne({
                    where: {
                        VoucherCode: createVoucher.code
                    }
                })

                if (getVoucherCategory)
                    return res.send('Voucher đã tồn tại bên VoucherCategory');
                const getVoucher = await Voucher.findByPk(createVoucher.code);
                const product = await db.product.findByPk(item);

                getVoucherProduct = await getVoucher.addProducts(product);

            })
            return res.send("Added voucher");

        }
        if (categories?.length > 0) {
            categories.forEach(async item => {
                const getVoucherProduct = await db.voucherProduct.findOne({
                    where: {
                        VoucherCode: createVoucher.code
                    }
                })
                console.log(getVoucherProduct)
                if (getVoucherProduct) {
                    return res.send('Voucher đã tồn tại bên VoucherProduct');
                }
                const getVoucher = await Voucher.findByPk(createVoucher.code);
                const category = await db.category.findByPk(item);
                console.log(getVoucher);
                getVoucherCategory = await getVoucher.addProduct_categories(category);
            })
            return res.send("Added voucher");

        }

        res.send("Added voucher");
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
exports.findAllVoucherCategoryProductByPage = async (req, res) => {
    try {

        const { page, size, is_fixed_discount } = req.query;
        console.log(req.query)
        const condition = is_fixed_discount ? { is_fixed_discount: { [Op.like]: `%${is_fixed_discount}%` } } : {};
        console.log(condition)
        const { limit, offset } = getPagination(page, size);
        const data = await Voucher.findAndCountAll({
            where: condition, limit, offset
        });

        // duyệt từng phần tử trong items
        const dataValuesArray = data.rows?.map((item) => item.dataValues);

        let voucherInclude = await Promise.all(
            dataValuesArray.map(async item => {
                const categories = await db.voucherCategory.findAll({
                    where: {
                        VoucherCode: item.code,
                    },
                    include: [
                        {
                            model: db.category,
                            attributes: ['id', 'product_category_name']
                        }
                    ]
                })
                if (categories.length > 0) {
                    item.categories = categories;
                    // console.log(item.categories)
                    return { ...item }
                }
                const products = await db.voucherProduct.findAll({
                    where: {
                        VoucherCode: item.code
                    },
                    include: [
                        {
                            model: db.product,
                            attributes: ['id', 'name']
                        }
                    ]
                })
                if (products.length > 0) {
                    item.products = products;
                    return { ...item }
                }
                return { ...item };


            })
        )
        // console.log(voucherInclude)
        data.rows = voucherInclude
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
exports.findOneIncludeCategoryOrProduct = async (req, res) => {
    const code = req.params.code;
    try {
        console.log(code)
        let getVoucher = await Voucher.findByPk(code);
        getVoucher = getVoucher.dataValues;
        const categories = await db.voucherCategory.findAll({
            where: {
                VoucherCode: code,
            },
            include: [
                {
                    model: db.category,
                    attributes: ['id', 'product_category_name']
                }
            ]
        })
        if (categories.length > 0) {
            getVoucher.categories = categories;
            // console.log(item.categories)

        }
        const products = await db.voucherProduct.findAll({
            where: {
                VoucherCode: code
            },
            include: [
                {
                    model: db.product,
                    attributes: ['id', 'name']
                }
            ]
        })
        if (products.length > 0) {
            // const productArray=products.map(item=>item.dataValues);
            getVoucher.products = products
        }

        res.send(getVoucher);
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving Voucher with code=" + err
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
exports.updateVoucherVoucherCategoryProduct = async (req, res) => {
    const code = req.params.code;
    try {
        console.log(code)
        const voucher = {};
        const {

            discount_amount,
            discount_percentage,
            minimize,
            start_date,
            end_date,
            is_fixed_discount,
            quantity,
            total,
            min_order_amount,
            products,
            categories

        } = req.body;

        discount_amount ? voucher.discount_amount = discount_amount : null;
        discount_percentage ? voucher.discount_percentage = discount_percentage : null;
        minimize ? voucher.minimize = minimize : null;
        start_date ? voucher.start_date = start_date : null;
        end_date ? voucher.end_date = end_date : null;
        is_fixed_discount ? voucher.is_fixed_discount = is_fixed_discount : null;
        quantity ? voucher.quantity = quantity : 0;
        total ? voucher.total = total : null;
        min_order_amount ? voucher.min_order_amount = min_order_amount : null;
        products ? voucher.products = products : null;
        categories ? voucher.categories = categories : null;

        if (voucher?.categories) {

            await db.voucherCategory.destroy({ where: { VoucherCode: code } })
            const splitCategories = categories.map(item => {
                db.voucherCategory.create({ VoucherCode: code, ProductCategoryId: item.value })
            });
        }
        if (voucher?.products) {
            await db.voucherProduct.destroy({ where: { VoucherCode: code } })
            const splitProduct = products.map(item => {
                db.voucherProduct.create({ VoucherCode: code, ProductId: item.value })
            });
        }

        const num = await Voucher.update(voucher, { where: { code: code } });

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
            message: "Error updating Voucher with code=" + err
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

        console.log(req.body.product)
        const productIds = req.body.product.map(item => item.ProductId);


        const categoryIds = req.body.product.map(item => item.Product.ProductCategoryId);

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
                    through: {
                        model: db.voucherCategory,
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
