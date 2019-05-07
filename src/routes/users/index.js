const router = require('express').Router()
const User = require('../../database/models/user')
const Order = require('../../database/models/order')
const { failure, serverError } = require('../../utils/responses')
const { isAuthorized, isAdmin, isUser } = require('../../middlewares')

router.get('/', isAuthorized, isAdmin, async (req,res) => {
    try {
        const users = await User.find({})
        if(!users) return res.status(400).json(failure('Users not found'))
        return res.render('users', {
            items : users,
            user : req.session.user,
            isAuthorized : true
        })
    }
    catch (e) {
        console.error(e.toString())
        return res.status(500).json(serverError())
    }
})

router.get('/admin/:id', isAuthorized, isAdmin, async (req, res) => {
    try {
        const id = req.params.id
        if(!id) return res.status(400).json(failure('Invalid user id'))
        const user = await User.findOne({
            _id: id
        })
        if(!user) return res.status(400).json(failure('No such user'))
        await User.findByIdAndUpdate(id, {
            role: 'admin'
        })
        await Order.deleteMany({
            author: user.login
        })
        return res.status(200).redirect('/')
    }
    catch (e) {
        console.error(e.toString())
        return res.status(500).json(serverError())
    }
})

router.get('/employee/:id', isAuthorized, isAdmin, async (req, res) => {
    try {
        const id = req.params.id
        if(!id) return res.status(400).json(failure('Invalid user id'))
        const user = await User.findOne({
            _id: id
        })
        if(!user) return res.status(400).json(failure('No such user'))
        await User.findByIdAndUpdate(id, {
            role: 'employee'
        })
        await Order.deleteMany({
            author: user.login
        })
        return res.status(200).redirect('/')
    }
    catch (e) {
        console.error(e.toString())
        return res.status(500).json(serverError())
    }
})

router.get('/user/:id', isAuthorized, isAdmin, async (req, res) => {
    try {
        const id = req.params.id
        if(!id) return res.status(400).json(failure('Invalid user id'))
        const user = await User.findOne({
            _id: id
        })
        if(!user) return res.status(400).json(failure('No such user'))
        await User.findByIdAndUpdate(id, {
            role: 'user'
        })
        return res.status(200).redirect('/')
    }
    catch (e) {
        console.error(e.toString())
        return res.status(500).json(serverError())
    }
})

router.get('/delete/:id', isAuthorized, isUser, async (req, res) => {
    try {
        await User.findByIdAndRemove(req.params.id)
        return res.status(200).redirect('/')
    }
    catch (e) {
        console.error(e.toString())
        return res.status(500).json(serverError())
    }
})

module.exports = router
