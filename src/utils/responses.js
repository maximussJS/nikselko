const success = (message, data = null) =>
    data === null ?
        ({
            success: true,
            message: message
        })
        :
        ({
            success: true,
            message: message,
            data: data
        })

const failure = message => ({
    success: false,
    message: message
})

module.exports = {
    success,
    failure,
    serverError: () => failure('Internal Server Error')
}
