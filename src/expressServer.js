const express = require('express')
const path = require('path')
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
app.use(express.static(path.join(__dirname + '/public')))

const mongoUrl = process.env.NODE_ENV === 'local' ?
    `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/?authSource=admin&replicaSet=rs0&retryWrites=true&w=majority&directConnection=true` :
    `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/?retryWrites=true&w=majority&appName=BBY26`

console.log(mongoUrl)

const options = {
    mongoUrl: mongoUrl,
    mongoOptions: {
        dbName: process.env.DATABASE_NAME,
    },
    crypto: {
        secret: process.env.MONGODB_SESSION_SECRET,
    },
    ttl: process.env.SESSION_TTL,
}

app.get('/', (req, res) => {
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
    return res.status(404).render('404', { error: 'Page does not exist!', pictureID: req.session.picture })
})

app.use((err, req, res, next) => {
    console.error(err)
    return res.status(err.code || 500).json({ msg: err.msg })
})

module.exports = { server, app, mongoUrl }
