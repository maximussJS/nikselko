const router = require('express').Router()
const Order = require('../../database/models/order')
const { failure, serverError } = require('../../utils/responses')
const { isEmployee, isAuthorized, isAuthor } = require('../../middlewares')

router.get('/', isEmployee, async (req ,res) => {
    try {
        const orders = await Order.find().sort({
            createdAt: -1
        })
        return res.status(200).render('index', {
            isAuthorized : true,
            isAdmin : req.session.user.role === 'admin',
            items: orders,
            isEmployee: req.session.user.role === 'employee',
            user: req.session.user
        })
    }
    catch (e) {
        console.error(e)
        return res.status(500).json(serverError())
    }
})

router.get('/add', isAuthorized, (req,res) => res.render('add'))

router.get('/edit/:id', isAuthorized, isAuthor, (req,res) => res.render('edit', {
    item : res.locals.order
}))

router.post('/add', isAuthorized, async (req,res) => {
    try {
        const { title, text } = req.body
        if(!title) return res.status(400).json(failure('Title param is required'))
        if(title.length > 20) return res.status(400).json(failure('Invalid title length'))
        if(!text) return res.status(400).json(failure('Text param is required'))
        if(text.length > 300) return res.status(400).json(failure('Invalid text length'))
        const order = new Order({
            title: title,
            text: text,
            author: req.session.user.login
        })
        await order.save()
        return res.status(200).redirect('/')
    }
    catch (e) {
        console.error(e)
        return res.status(500).json(serverError())
    }
})

router.post('/edit/:id', isAuthorized, isAuthor, async (req,res) => {
    try {
        const { title, text } = req.body
        if(!title) return res.status(400).json(failure('Title param is required'))
        if(title.length > 20) return res.status(400).json(failure('Invalid title length'))
        if(!text) return res.status(400).json(failure('Text param is required'))
        if(text.length > 300) return res.status(400).json(failure('Invalid text length'))
        await Order.findByIdAndUpdate(req.params.id, {
            title,
            text
        })
        return res.status(200).redirect('/')
    }
    catch (e) {
        console.error(e)
        return res.status(500).json(serverError())
    }
})

router.get('/delete/:id', isAuthorized, isAuthor, async (req, res) => {
    try {
        await Order.findByIdAndRemove(req.params.id)
        return res.status(200).redirect('/')
    }
    catch (e) {
        console.error(e)
        return res.status(500).json(serverError())
    }
})

router.get('/do/:id', isAuthorized, isEmployee, async (req, res) => {
    try {
        const id = req.params.id
        if(!id) return res.status(400).json(failure('Id param required'))
        const order = await Order.findOne({
            _id: id
        })
        if(!order) return res.status(400).json(failure('Invalid id'))
        await Order.findByIdAndUpdate(id, {
            status: true
        })
        return res.status(200).redirect('/')
    }
    catch (e) {
        console.error(e)
        return res.status(500).json(serverError())
    }
})

module.exports = router
