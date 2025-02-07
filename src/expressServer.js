const express = require('express')
const path = require('path')
const { Client } = require('pg')
const compression = require('compression')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './data')
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + '.csv')
    },
})

const upload = multer({ storage: storage })

const app = express()
const server = require('http').createServer(app)
app.use(compression())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
// app.use(express.static(__dirname + '/public'))

const connectObj = process.env.NODE_ENV === 'local' ?
    {
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        database: process.env.DATABASE_NAME,
    } :
    {
        user: 'dbuser',
        password: 'secretpassword',
        host: 'database.server.com',
        port: 3211,
        database: 'mydb',
    }
const client = new Client(connectObj)

app.get('/', async (req, res) => {
    const result = await client.query('SELECT * FROM dubai_clean')
    console.log(result.rows[0])

    return res.status(200).send('Hello')
})

app.get('/health', (_, res) => {
    return res.status(200).send('ok')
})

app.post('/upload-data', upload.single('uploaded_file'), (req, res) => {
    return res.status(200).json({
        status: 'ok',
    })
})

app.get('*', (req, res) => {
    return res.status(404).json({ error: 'Page does not exist!' })
})

app.use((err, req, res, next) => {
    console.error(err)
    return res.status(err.code || 500).json({ msg: err.msg })
})

module.exports = { server, app, client }
