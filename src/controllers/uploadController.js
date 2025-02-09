const { uploadService } = require('../services')

const uploadGET = async (req, res, next) => {
    try {
        const results = await uploadService.uploadGET()
        return res.json({
            status: 'ok',
            data: results.rows,
        })
    } catch (error) {
        next(error)
    }
}

const uploadPOST = async (req, res, next) => {
    try {
        await uploadService.uploadPOST(req)
        return res.status(200).json({
            status: 'ok',
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    uploadGET,
    uploadPOST,
}
