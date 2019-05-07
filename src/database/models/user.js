const { model, Schema } = require('mongoose')

const User = model('User',
    new Schema(
        {
            login: {
                type: String,
                required: true,
                unique: true,
                length: 20
            },
            password: {
                type: String,
                required: true,
                length: 200
            },
            role: {
                type: String,
                enum: ['admin', 'user', 'employee'],
                required: true,
            }
        },
        {
            timestamps: true
        }
    )
)

module.exports = User
