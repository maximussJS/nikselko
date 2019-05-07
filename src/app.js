const  { join } = require('path')

require('dotenv').config({
    path: join(__dirname, '..', '.env'),
})

const express = require('express')
const cors = require('cors')
const db = require('./database')
const helmet = require('helmet')
const morgan = require('morgan')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const { json, urlencoded } = require('body-parser')

const app = express()

app.use(cors())
app.use(helmet())
app.use(cookieParser())
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false
}))
app.use(json())
app.use(urlencoded({
    extended: true
}))
app.use(morgan('dev'))
app.use('/', express.static(join(__dirname, 'public')))
app.use(require('./routes'))

app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001

app.listen(port, () => console.log('listening on port : ', port))

process
    .on('unhandledRejection', (reason, p) => console.error(reason, 'Unhandled Rejection at Promise', p))
    .on('uncaughtException', err => {
        console.error(err, 'Uncaught Exception thrown')
        process.exit(1)
    })
    .once('SIGINT', async () => {
        console.log('\nCtrl+C Server Stooped')
        await db.close()
        process.exit(0)
    })
