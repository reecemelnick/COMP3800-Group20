const express = require('express')
const path = require('node:path')
const compression = require('compression')
const { uploadRouter } = require('./routers')
const { client } = require('./util')
const { runPy } = require('./util')
const multer = require('multer')
const axios = require('axios')

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

app.get('/predict', (req, res) => {
    return res.sendFile(path.resolve(__dirname, 'public', 'html', 'predictDemographic.html'))
})

app.post('/predict/treatment-preference', express.json(), (req, res) => {
    runPy('models/model_v2/predict.py', [JSON.stringify(req.body)], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            try {
                const parsedResult = JSON.parse(result)
                res.json({ data: parsedResult });
            } catch (err) {
                console.log("Error: " + err);
            }
        }
    })
})

app.post('/predict/buyer', express.json(), (req, res) => {
    runPy('models/model_buyers_v1/predict.py', [JSON.stringify(req.body)], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            try {
                const parsedResult = JSON.parse(result)
                res.json({ data: parsedResult });
            } catch (err) {
                console.log("Error: " + err);
            }
        }
    })
})

app.get('/getschedule', async (req, res) => {
    const result = await client.query('SELECT * FROM schedule_count_view')
    return res.status(200).json({
        data: result.rows,
    })
})

app.get('/upload', (req, res) => {
    return res.sendFile(path.resolve(__dirname, 'public', 'html', 'upload.html'))
})

app.get('/download', (req, res) => {
    const fileName = req.query.filename
    const filePath = `raw_data/${fileName}`
    res.download(filePath, req.query.display, (err) => {
        if (err) {
            res.status(404).send('File not found on server');
        }
    });
})

app.use('/upload', uploadRouter)

app.get('/xray', (req, res) => {
    return res.sendFile(path.resolve(__dirname, 'public', 'html', 'xray.html'))
})

app.post('/xray', multer({ storage: multer.memoryStorage() }).single('uploaded_file'), (req, res) => {

    if (!req.file) {
        return res.status(400).json({ error: "No image attached" })
    }

    const base64Image = req.file.buffer.toString('base64');

    axios({
        method: "POST",
        url: "https://outline.roboflow.com/panoramic-x-rays-dqq7b/2",
        params: {
            api_key: `${process.env.ROBOFLOW_KEY}`
        },
        data: base64Image,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
        .then(function (response) {
            const { image, predictions } = response.data
            res.json({
                data: { image, predictions }
            })
        })
        .catch(function (error) {
            if (error.status === 400) {
                res.status(400).json({ error: `${error.response.data.message}` })
            } else {
                res.status(500).json({ error: "Internal server error" })
            }
        });
})

app.get('*', (req, res) => {
    return res.status(404).json({ error: 'Page does not exist!' })
})

app.use((error, req, res, next) => {
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        error.code = 400
    }
    error.code ? console.error(error.message) : console.error(error)
    return res.status(error.code || 500).json({ msg: error.message })
})

module.exports = { server, app, path }
