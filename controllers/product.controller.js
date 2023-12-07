const db = require("../models");
const Product = db.product;
const SubscriptionPlan = db.SubscriptionPlan;
const TransactionDetail = db.TransactionDetail;
const Review = db.review;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");

exports.create = async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
            return;
        }

        const product = {
            name: req.body.name||'',
            description: req.body.description||'',
            content: req.body.content||'',
            image: req.body.image||'',
            thumbnail: req.body.thumbnail||'',
            published: parseInt(req.body.published)||false,
            ProductCategoryId: req.body.ProductCategoryId,
            ProductTypeId: req.body.ProductTypeId
        };

        await Product.create(product);
        res.send('Added product');
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Product."
        });
    }
};

exports.findAll = async (req, res) => {
    try {
        const name = req.query.name;
        const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
        const products = await Product.findAll({ where: condition });
        res.send(products);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Products."
        });
    }
};

exports.findAllByPage = async (req, res) => {
    try {
        const { page, size, name } = req.query;
        const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
        const { limit, offset } = getPagination(page, size);
        const data = await Product.findAndCountAll({ where: condition, limit, offset });
        console.log(data)
        const response = getPagingData(data, page, limit);
        res.send(response);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Products."
        });
    }
};

exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findByPk(id);
        res.send(product);
    } catch (err) {
        res.status(500).send({
            message: `Error retrieving Product with id=${id}: ${err.message}`
        });
    }
};

exports.findOneDetail = async (req, res) => {
    const productId = req.params.id;
    try {

        console.log('giá trị' + productId)
        const product = await Product.findByPk(req.params.id);

        const subscriptionPlans = await db.subscription_plan.findAll({
            where: {
                ProductId: productId,
                published: true
            },
        });

        const SubscriptionPlanIds = subscriptionPlans.map((subscriptionPlan) => subscriptionPlan.ProductId);

        const transactionDetails = await db.transaction_details.findAll({
            where: {
                SubscriptionPlanId: { [Op.in]: SubscriptionPlanIds },
                AccountId: { [Op.ne]: null }
            },
        });

        const transactionDetailIds = transactionDetails.map((transactionDetail) => transactionDetail.id);
        const totalSold = transactionDetailIds.length;

        const reviews = await db.review.findAll({
            where: {
                id: { [Op.in]: transactionDetailIds },
            },
        });
        let rating = 0;
        reviews.map((review) => { review.id; rating += review.vote });
        res.send({
            product,
            subscriptionPlans,
            totalSold,
            rating,
            reviews
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || `Error retrieving Product details with id=${req.params.id}: ${err.message}`
        });
    }
};
exports.findAllProductByPage = async (req, res) => {
    const categoryid = req.query.categoryid ? req.query.categoryid : null;
    // const productId = req.params.productid?req.params.productid:null;
    // const productName = req.params.product?req.params.product:null;
    const categoryName = req.query.categoryname ? req.query.categoryname : '';
    // console.log(categoryName);
    try {
        const { limit, offset } = getPagination(req.query.page, req.query.size);
        // tìm với tên là category 
        // const condition = name ? { name: { [Op.like]: `%${categoryName}%` } } : null;
        const categorys = await db.category.findOne({ where: { product_category_name: { [Op.like]: `%${categoryName}%` } } });
        if (!categorys) {
            const response = getPagingData([], req.params.page, req.params.limit);
            return res.send({
                response
            });
        }
        // console.log(categorys)
        // console.log(categorys)
        const categoryIds = categorys.id;
        const products = await db.product.findAndCountAll({
            where: {
                ProductCategoryId: categoryIds,
                published: { [Op.ne]: null }

            },
            limit, offset
        });

        // console.log(products);
        const data = await Promise.all(products.rows.map(async (item) => {
            // console.log(item.dataValues.id);
            const product = await Product.findByPk(item.dataValues.id); 
            // console.log(product)
            const subscriptionPlans = await db.subscription_plan.findAll({
                where: {
                    ProductId: item.dataValues.id,
                    published: true
                },
            });

            const SubscriptionPlanIds = subscriptionPlans.map((subscriptionPlan) => subscriptionPlan.ProductId);

            const transactionDetails = await db.transaction_details.findAll({
                where: {
                    SubscriptionPlanId: { [Op.in]: SubscriptionPlanIds },
                    AccountId: { [Op.ne]: null }
                },
            });

            const transactionDetailIds = transactionDetails.map((transactionDetail) => transactionDetail.id);
            const totalSold = transactionDetailIds.length;

            const reviews = await db.review.findAll({
                where: {
                    id: { [Op.in]: transactionDetailIds },
                },
            });
            let rating = 0;
            reviews.map((review) => { review.id; if (review.vote) rating += review.vote });

            return {
                product,
                subscriptionPlans,
                totalSold,
                rating,
                reviews
            };
        }

        ));
        products.rows = data;
        
        return res.send(
            getPagingData(products, req.params.page, limit)
        );
    } catch (err) {
        res.status(500).send({
            message: err.message || `Error retrieving Product details with id=${req.params.id}: ${err.message}`
        });
    }
};
exports.findAllProductCategoryTypeByPage = async (req, res) => {
    // const categoryid = req.query.categoryid ? req.query.categoryid : null;
    // const productId = req.params.productid?req.params.productid:null;
    // const productName = req.params.product?req.params.product:null;
    const categoryId = req.query.categoryid ? req.query.categoryid : null;
    const typeId = req.query.typeid ? req.query.typeid : null;
    console.log(req.query);
    console.log(typeId)
    try {
        const { limit, offset } = getPagination(req.query.page, req.query.size);
        console.log(`limit ${limit}, offset: ${offset}`)
        // tìm với tên là category 
        // const condition = name ? { name: { [Op.like]: `%${categoryName}%` } } : null;

        // const categorys = await db.category.findOne({ where: { id: categoryId } });
        // if (!categorys) {
        //     const response = getPagingData([], req.params.page, req.params.limit);
        //     return res.send({
        //         response
        //     });
        // }
        // const types = await db.product_type.findOne({ where: { id: 0 } });
        // if (!types) {
        //     const response = getPagingData([], req.params.page, req.params.limit);
        //     return res.send({
        //         response
        //     });
        // }
        // // console.log(categorys)
        // // console.log(categorys)
        // const categoryId = categorys.id;
        // const typeId=types
        let whereCondition = {
           
        };
        
        if (categoryId!=null&&categoryId!='undefined') {
            whereCondition.ProductCategoryId = categoryId;
        }
        
        if (typeId!=null&&typeId!='undefined') {
            whereCondition.ProductTypeId = typeId;
        }
        const products = await db.product.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: db.product_type,
                    as: 'Product_type', // Alias cho quan hệ
                    attributes: ['id', 'product_type_name'] // Chọn các trường bạn muốn lấy từ bảng productType
                },
                {
                    model: db.category,
                    as: 'Product_category', // Alias cho quan hệ
                    attributes: ['id', 'product_category_name'] // Chọn các trường bạn muốn lấy từ bảng productType
                }
            ],
            limit, offset
        });

        console.log(products);
        const data = await Promise.all(products.rows.map(async (item) => {
            // console.log(item.dataValues.id);
            // const product = await Product.findByPk(item.dataValues.id); 
            const product=item;
            console.log(item)
            const subscriptionPlans = await db.subscription_plan.findAll({
                where: {
                    ProductId: item.dataValues.id
                },
            });

            const SubscriptionPlanIds = subscriptionPlans.map((subscriptionPlan) => subscriptionPlan.ProductId);

            const transactionDetails = await db.transaction_details.findAll({
                where: {
                    SubscriptionPlanId: { [Op.in]: SubscriptionPlanIds },
                    AccountId: { [Op.ne]: null }
                },
            });

            const transactionDetailIds = transactionDetails.map((transactionDetail) => transactionDetail.id);
            const totalSold = transactionDetailIds.length;

            const reviews = await db.review.findAll({
                where: {
                    id: { [Op.in]: transactionDetailIds },
                },
            });
            let rating = 0;
            reviews.map((review) => { review.id; if (review.vote) rating += review.vote });

            return {
                product,
                subscriptionPlans,
                totalSold,
                rating,
                reviews
            };
        }

        ));
        products.rows = data;
        console.log(`gia tri ${limit}`)
        return res.send(
            getPagingData(products, req.query.page, limit)
        );
    } catch (err) {
        res.status(500).send({
            message: err.message || `Error retrieving Product details with id=${req.params.id}: ${err.message}`
        });
    }
};

exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const [num] = await Product.update(req.body, { where: { id: id } });
    

        if (num === 1) {
            res.send({
                message: "Product was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: `Error updating Product with id=${id}: ${err.message}`
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const num = await Product.destroy({ where: { id: id } });
        if (num === 1) {
            res.send({
                message: "Product was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: `Could not delete Product with id=${id}: ${err.message}`
        });
    }
};

exports.deleteAll = async (req, res) => {
    try {
        const nums = await Product.destroy({
            where: {},
            truncate: false
        });
        res.send({
            message: `${nums} Products were deleted successfully!`
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while removing all Products."
        });
    }
};

exports.findAllPublished = async (req, res) => {
    try {
        const products = await Product.findAll({ where: { published: true } });
        res.send(products);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Products."
        });
    }
};
