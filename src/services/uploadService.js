const { CustomError, client } = require('../util')

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

    const result = await insertHistory(filename, originalname)
    console.log('Inserted:', result.rows[0])
    return true
}

module.exports = {
    uploadGET,
    uploadPOST,
    insertHistory,
    checkFileExists,
}