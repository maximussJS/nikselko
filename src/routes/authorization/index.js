const router = require('express').Router()

router.use('/login', require('./login'))
router.use('/registration', require('./registration'))
router.use('/logout', require('./logout'))

module.exports =router
