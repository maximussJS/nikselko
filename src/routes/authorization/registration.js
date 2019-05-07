const router = require('express').Router()
const User = require('../../database/models/user')
const { encryptPassword }  = require('../../utils/security')
const { failure, serverError} = require('../../utils/responses')

router.get('/' , (req,res) => res.render('register'))

router.post('/' , async (req,res) => {
    try {
        const { login, password, confirm } = req.body
        if (!login) return res.status(400).json(failure('Login param is required'))
        if (login.length > 20) return res.status(400).json(failure('Invalid login length'))
        if (!password) return res.status(400).json(failure('Password param is required'))
        if (password.length > 20) return res.status(400).json(failure('Invalid password length'))
        if (!confirm) return res.status(400).json(failure('Login param is required'))
        if (password !== confirm) return res.status(400).json(failure('Password are different'))
        const user = await User.findOne({
            login: login
        })
        if(!user) {
            const u = new User({
                login: login,
                password: encryptPassword(password),
                role: 'user'
            })
            await u.save()
            return res.status(201).redirect('/authorization/login')
        }
        else return res.render('error', {
            title: ' Registration Error',
            message: `Login ${login} is already taken`,
            error: {
                status: 400
            }
        })
    }
    catch (e) {
        console.error(e.toString())
        return res.status(500).json(serverError())
    }
})

module.exports = router
