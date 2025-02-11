const express = require('express')
const path = require('node:path')
const compression = require('compression')
const { uploadRouter } = require('./routers')
const { client } = require('./util')

const app = express()
const server = require('http').createServer(app)
app.use(compression())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname + '/public')))

app.get('/', (req, res) => {
    return res.status(200).send('Hello')
})

app.get('/health', (_, res) => {
    return res.status(200).send('ok')
})

app.get('/schedule', (req, res) => {
    return res.sendFile(path.resolve(__dirname, 'public', 'html', 'schedule.html'))
})

app.get('/getschedule', async (req, res) => {
    const result = await client.query('SELECT * FROM schedule_count_view')
    return res.status(200).json({
        data: result.rows,
    })
})

app.use('/upload', uploadRouter)

app.get('*', (req, res) => {
    return res.status(404).json({ error: 'Page does not exist!' })
})

app.use((error, req, res, next) => {
    error.code ? console.error(error.message) : console.error(error)
    return res.status(error.code || 500).json({ msg: error.message })
})

module.exports = { server, app, path }
