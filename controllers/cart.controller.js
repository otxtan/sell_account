const { where } = require("sequelize");
const db = require("../models");
const Cart = db.cart;
const User = db.user;
const VoucherCategory = db.voucherCategory;
const VoucherProduct = db.voucherProduct;
const SubscriptionPlan = db.subscription_plan;
const Voucher = db.voucher;
const Transaction = db.transaction;
const TransactionDetail = db.transaction_details;
const Op = db.Sequelize.Op;
const Product = db.product;


const { getPagination, getPagingData } = require("./utils");

// Create and Save a new Cart
exports.create = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    try {
        const condition = {
            UserId: req.body.UserId,
            SubscriptionPlanId: req.body.SubscriptionPlanId
        };
        const cart = await Cart.findOne({
            where: condition,
        });
        if (!cart) {
            const user = await User.findByPk(req.body.UserId);
            console.log(user)
            const subscription = await SubscriptionPlan.findByPk(parseInt(req.body.SubscriptionPlanId));
            // createCart = await user.addSubscription_plans(subscription, { through: { quantity: parseInt(req.body.quantity) } });
            createCart = await db.cart.create(
                {
                    UserId: user.id,
                    SubscriptionPlanId: subscription.id,
                    quantity: parseInt(req.body.quantity)
                })
            console.log(createCart)
            return res.send(createCart);

        }
        else {
            console.log(typeof req.body.quantity);

            console.log(cart.quantity);
            cart.quantity += parseInt(req.body.quantity);
            cart.save()
        }
        return res.send(cart);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Cart."
        });
    }
};

exports.findByUser = async (req, res) => {
    try {
        const carts = await Cart.findAll({
            where: { UserId: req.params.userid },
            include: [
                {
                    model: db.subscription_plan,

                    include: [
                        {
                            model: db.product,

                        },
                    ],
                },
            ],

        });
        res.send(carts);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Carts."
        });
    }
};

// Retrieve all Carts from the database.
exports.findAll = async (req, res) => {
    try {
        const carts = await Cart.findAll();
        res.send(carts);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Carts."
        });
    }
};

// Retrieve by Paging
exports.findAllByPage = async (req, res) => {
    const { page, size, UserId } = req.query;
    var condition = UserId ? { UserId: { [Op.like]: `%${UserId}%` } } : null;
    const { limit, offset } = getPagination(page, size);

    try {
        const data = await Cart.findAndCountAll({
            where: condition,
            limit,
            offset
        });

        const response = getPagingData(data, page, limit);
        res.send(response);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Carts."
        });
    }
};

// Find a single Cart with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const cart = await Cart.findByPk(id);
        if (cart) {
            res.send(cart);
        } else {
            res.status(404).send({
                message: "Cart not found with id=" + id
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving Cart with id=" + id
        });
    }
};

// Update a Cart by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;
    console.log(req.body);
    try {

        if (parseInt(req.body.quantity) == 0) {

            await Cart.destroy({ where: { id: id } });
            res.send({
                message: "Cart was updated successfully.",

            });
            return;
        }
        const [num, updatedCart] = await Cart.update(req.body, {
            where: { id: id }
        });

        if (num === 1) {
            res.send({
                message: "Cart was updated successfully.",
                updatedCart
            });
        } else {
            res.status(400).send({
                message: `Cannot update Cart with id=${id}. Maybe Cart was not found or req.body is empty!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error updating Cart with id=" + id
        });
    }
};

// Delete a Cart with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await Cart.destroy({
            where: { id: id }
        });

        if (num === 1) {
            res.send({
                message: "Cart was deleted successfully!"
            });
        } else {
            res.status(404).send({
                message: `Cannot delete Cart with id=${id}. Maybe Cart was not found!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Could not delete Cart with id=" + id
        });
    }
};

// Delete all Carts from the database.
exports.deleteAll = async (req, res) => {
    try {
        const num = await Cart.destroy({
            where: {},
            truncate: false
        });

        res.send({
            message: `${num} Carts were deleted successfully!`
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while removing all Carts."
        });
    }
};
async function CheckOut(Items, VoucherCode) {
    let total = 0;
    let newTotal = 0;
    let totalDiscount = 0;

    console.log('voucher' + VoucherCode)
    const getVoucher = await Voucher.findOne(
        {
            where: {
                code: VoucherCode,
            }
        }
    )
    // console.log(getVoucher)
    // kiểm tra số lượng voucher còn lại 
    let oldTotal = 0;
    if (getVoucher && getVoucher.quantity <= getVoucher.total) {
        // lặp qua từng sản phẩm
        Items = await Promise.all(Items.map(async (item) => {
            // lấy loại gói
            let price = 0;
            const getSubscriptionPlan = await SubscriptionPlan.findByPk(item.SubscriptionPlanId);
            if (!getSubscriptionPlan)
            // throw new Error("Sản phẩm không còn tồn tại");
            {
                // discount = getVoucher.discountamount;
                // totalDiscount += discount;
                oldTotal = 0;
                newTotal = 0;
                total += oldTotal;
                return {
                    ...item,
                    price,
                    oldTotal,
                    newTotal,
                    productId: getSubscriptionPlan.ProductId,
                    message: 'Sản phẩm không còn tồn tại'
                };
                // return { error: 'Sản phẩm không còn tồn tại', errorCode: 'The product is no longer available' };
            }
            price = (getSubscriptionPlan.price * (1 - (getSubscriptionPlan.discount_percentage / 100)));
            if (item.quantity > (getSubscriptionPlan.total - getSubscriptionPlan.quantity_sold)) {
                {
                    // discount = getVoucher.discountamount;
                    // totalDiscount += discount;

                    oldTotal = 0;
                    newTotal = 0;
                    total += oldTotal;
                    return {
                        ...item,
                        price,
                        oldTotal,
                        newTotal,
                        productId: getSubscriptionPlan.ProductId,
                        message: 'Số lượng không đủ'
                    };
                    // return { error: 'Số lượng không đủ', errorCode: 'The product is no longer available' };
                }
                // throw new Error("Số lượng không đủ");
                // return { error: 'Số lượng không đủ', errorCode: 'QUANTITY_NOT_ENOUGH' };
            }

            // lấy sản phẩm từ loại sản phẩm ở trên           
            price = (getSubscriptionPlan.price * (1 - (getSubscriptionPlan.discount_percentage / 100)));
            const getProduct = await Product.findByPk(getSubscriptionPlan.ProductId);
           
            // lấy voucher với điều kiện có productid hoặc có productCategoryId trùng khớp

            const getVoucherCategory = await VoucherCategory.findOne({
                where: {
                    VoucherCode: VoucherCode,
                    ProductCategoryId: getProduct.ProductCategoryId
                    // ProductId: null
                }

            })
            const getVoucherProduct = await VoucherProduct.findOne({
                where: {
                    VoucherCode: VoucherCode,
                    // ProductCategoryId:null,
                    ProductId: getSubscriptionPlan.ProductId
                }
            })
            getVoucherCategory ? console.log(`giá trị của getvouchercategory ${JSON.stringify(getVoucherCategory.dataValues)}`) : undefined;
            getVoucherProduct ? console.log(` giá trị của getvoucherproduct ${JSON.stringify(getVoucherProduct.dataValues)}`) : undefined;
            let getVoucherCategoryProduct;
            if (getVoucherCategory)
                getVoucherCategoryProduct = getVoucherCategory;
            else if (getVoucherProduct)
                getVoucherCategoryProduct = getVoucherProduct;
            // kiểm tra voucher đã lấy
            if (getVoucherCategoryProduct) {
                // kiểm tra xem sản phẩm có đủ điều kiện áp dụng voucher không
                if ((price * item.quantity) >= getVoucher.min_order_amount) {
                    let discount;
                    // kiểm tra xem voucher áp dụng theo % hay giảm trực tiếp   
                    if (getVoucher.discount_percentage != null) {
                        oldTotal = price * item.quantity;
                        discount = (price * item.quantity) * (getVoucher.discount_percentage / 100);
                        if (totalDiscount + discount > Number(getVoucher.minimize)) {
                            console.log(`gia tri cua typeof ${typeof getVoucher.minimize}`)
                            newTotal = (price * item.quantity) - (Number(getVoucher.minimize) - totalDiscount);
                            totalDiscount = Number(getVoucher.minimize);
                        }
                        else {
                            totalDiscount += discount;
                            // oldTotal = price * item.quantity;
                            newTotal = (price * item.quantity) - discount;

                        }
                        // thêm giá cũ giá mới
                        total += oldTotal;

                        return {
                            ...item,
                            price,
                            oldTotal,
                            newTotal,
                            productId: getSubscriptionPlan.ProductId,
                            message: `-${discount}`
                        };
                    }
                    else {
                        discount = getVoucher.discountamount;
                        oldTotal = price * item.quantity;
                        if ((totalDiscount + discount) > Number(getVoucher.minimize)) {
                            newTotal = (price * item.quantity) - (Number(getVoucher.minimize) - totalDiscount);
                            totalDiscount = Number(getVoucher.minimize);
                        }
                        else {

                            totalDiscount += discount;

                            newTotal = (price * item.quantity) - discount;
                        }
                        total += oldTotal;
                        return {
                            ...item,
                            price,
                            oldTotal,
                            newTotal,
                            productId: getSubscriptionPlan.ProductId,
                            message: `-${discount}`
                        };
                    }
                }
            }
            // tính giá và thêm giá vào item
            oldTotal = price * item.quantity
            total += oldTotal;
            return {
                ...item,
                price,
                oldTotal,
                productId: getSubscriptionPlan.ProductId,
                message: 'Chưa đủ điều kiện áp mã'

            };
        }))

    }
    else {


        Items = await Promise.all(Items.map(async (item) => {
            const getSubscriptionPlan = await SubscriptionPlan.findByPk(item.SubscriptionPlanId);
            if (getSubscriptionPlan) {
                price = (getSubscriptionPlan.price * (1 - (getSubscriptionPlan.discount_percentage / 100)));
                oldTotal = price * item.quantity;
                total += oldTotal;
                // Thêm thuộc tính mới vào mỗi đối tượng trong mảng
                return {
                    ...item,
                    price,
                    productId: getSubscriptionPlan.ProductId,
                    oldTotal,

                };
            }
            else {
                throw new Error("Sản phẩm không còn tồn tại");
            }

            // return item;
        }));
        // voucher ? message = 'Voucher không tồn tại hoặc đã hết lượt sử dụng':'';
    }
    
    return { Items, VoucherCode, total, totalDiscount, totalPayment: total - totalDiscount };


}
exports.checkout = async (req, res) => {
    try {
        console.log(req.body)
        const result = await CheckOut(req.body.Items, req.body.VoucherCode);
        console.log(result)
        res.send(result)
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while removing all Carts."
        });
    }
};
exports.payment = async (req, res) => {
    try {
        // console.log(req.body)
        // return res.send('pass')
        // check lại thông tin 
        const result = await CheckOut(req.body.Items, req.body.VoucherCode);
        console.log(result)
        const currentDate = new Date().toISOString().slice(0, -5).replace('T', ' ');
        // Format thời gian theo định dạng của SQL Server (YYYY-MM-DD HH:mm:ss)
        // const formattedDate = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
        const transaction = {
            transaction_date: currentDate,
            transaction_status: 0,
            total_amount: result.total,
            total_discount: result.totalDiscount,
            total_payment: result.totalPayment,
            PaymentMethodId: req.body.PaymentMethodId || 1,
            VoucherCode: req.body.VoucherCode || null,
            UserId: req.body.UserId
        }
        const createTransaction = await Transaction.create(transaction);
        result.Items.forEach(async element => {
            let transactionDetail = {
                quantity: element.quantity,
                oldTotal: element.oldTotal,
                newTotal: element.newTotal,
                price: element.price,
                transaction_date: currentDate,
                AccountId: req.body.Accountld || null,
                TransactionId: createTransaction.id,
                SubscriptionPlanId: element.SubscriptionPlanId
            }
            await TransactionDetail.create(transactionDetail);
            console.log("pass")

        });
        if (req.body.cartId.length > 0) {
            await db.cart.destroy({
                where: {
                    id: {
                        [Op.in]: req.body.cartId
                    }
                }
            }
            )
            console.log("pass")

        }



        res.send(createTransaction)
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while processing payment."
        });
    }
};
