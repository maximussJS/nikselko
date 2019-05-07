const crypto = require('crypto')

module.exports = {
    encryptPassword: password => {
        const hmac = crypto.createHmac('sha512', process.env.SERVER_SALT)
        hmac.update(password)
        return hmac.digest('hex')
    }
}
