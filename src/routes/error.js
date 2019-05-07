const router = require('express').Router()

router.use((req, res, next) => {
    const err = new Error('Page what you want did not found')
    err.status = 404
    next(err)
})

router.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: err,
        title: 'Page Not Found'
    })
})

module.exports = router
