const router = require('express').Router()
const { isAuthorized } = require('../../middlewares')

router.get('/', isAuthorized, (req,res) => {
    req.session.destroy()
    res.redirect('/authorization/login')
})

module.exports = router
