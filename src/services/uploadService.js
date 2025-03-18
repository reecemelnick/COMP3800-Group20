const { CustomError, client } = require('../util')
const { spawn } = require('child_process')
const fsPromises = require('node:fs/promises')

const run_pipeline = (filename) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', ['src/pipeline_runner.py', filename])

        pythonProcess.stdout.on('data', (data) => {
            console.log(`Output: ${data}`)
        })

        pythonProcess.stderr.on('data', (error) => {
            console.error(`Error: ${error}`)
            reject(error)
        })

        pythonProcess.on('close', async (code) => {
            console.log(`Process exited with code ${code}`)
            if (code === 1) {
                await fsPromises.unlink(filename)
                reject(new CustomError(400, 'Invalid format'))
            }
            resolve(code)
        })
    })
}

const uploadGET = () => {
    return client.query('SELECT fileName, fileNameOriginal, createdAt FROM upload_history')
}

const checkFileExists = (originalname) => {
    const query = `
    SELECT COUNT(*) 
    FROM public.upload_history 
    WHERE fileNameOriginal = $1;
    `

    return client.query(query, [originalname]).then(result => result.rows[0].count !== '0')
}

const insertHistory = (filename, originalname) => {
    const query = `
    INSERT INTO public.upload_history (fileName, fileNameOriginal)
    VALUES ($1, $2)
    RETURNING *;
    `
    const values = [filename, originalname]

    return client.query(query, values)
}

const uploadPOST = async (req) => {
    if (!req.file) {
        throw new CustomError(400, 'No file was uploaded.')
    }

    const { filename, originalname } = req.file

    await run_pipeline(`raw_data/${filename}`)

    const result = await insertHistory(filename, originalname)
    console.log('Inserted:', result.rows[0])

    return true
}

module.exports = {
    run_pipeline,
    uploadGET,
    uploadPOST,
    insertHistory,
    checkFileExists,
}