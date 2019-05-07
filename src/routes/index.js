const router = require('express').Router()
const User = require('../database/models/user')
const Order = require('../database/models/order')
const { isAuthorized } = require('../middlewares')
const { serverError } = require('../utils/responses')

router.get('/' , isAuthorized, async (req,res) => {
    try {
        let users = []
        let orders = []
        if(req.session.user.role === 'admin') {
            users = await User.find({}).sort({
                createdAt: -1
            })
            orders = await Order.find({}).sort({
                createdAt: -1
            })
        }
        else if (req.session.user.role === 'employee') {
            orders = await Order.find({}).sort({
                createdAt: -1
            })
        }
        else {
            orders = await Order.find({
                author: req.session.user.login
            }).sort({
                createdAt: -1
            })
        }
        return res.status(200).render('index', {
            isAuthorized : true,
            isAdmin : req.session.user.role === 'admin',
            items: orders,
            isEmployee: req.session.user.role === 'employee',
            user: req.session.user,
            users
        })
    }
    catch (e) {
        console.error(e)
        return res.status(500).json(serverError())
    }
})

router.use('/users', require('./users'))
router.use('/orders', require('./orders'))
router.use('/authorization', require('./authorization'))
router.use(require('./error'))

module.exports = router
