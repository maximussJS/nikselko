const { model, Schema } = require('mongoose')

const Order = model('Order',
    new Schema(
        {
            title: {
                type: String,
                required: true,
                length: 20
            },
            author: {
                type: String,
                required: true,
                length: 20
            },
            text: {
                type: String,
                required: true,
                length: 300
            },
            status: {
                type: Boolean,
                default: false
            }
        },
        {
            timestamps: true
        }
    )
)

module.exports = Order
