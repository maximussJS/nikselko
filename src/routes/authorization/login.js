const router = require('express').Router()
const User = require('../../database/models/user')
const { failure, serverError } = require('../../utils/responses')
const { encryptPassword } = require('../../utils/security')

router.get('/' , (req,res) => res.render('login'))

router.post('/', async (req,res) => {
    try {
        const { login, password } = req.body
        if(!login) return res.status(400).json(failure('Login param is required'))
        if(!password) return res.status(400).json(failure('Password param is required'))
        const user = await User.findOne({
            login: login
        })
        if (!user) return res.status(401).json(failure('Invalid login or password'))
        if (user && user.password === encryptPassword(password)) {
            req.session.user = user
            return res.status(200).redirect('/')
        }
        return res.render('error', {
            title: 'Login Error',
            message: 'Invalid login or password',
            error: {
                status: 401
            }
        })
    }
    catch (e) {
        console.error(e)
        return res.status(500).json(serverError())
    }
})

module.exports = router
