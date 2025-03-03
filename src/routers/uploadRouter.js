const express = require('express')
const router = express.Router()
const { uploadController } = require('../controllers/index')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const { CustomError } = require('../util')
const { uploadService } = require('../services')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './raw_data')
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + '.csv')
    },
})

const fileFilter = async (req, file, cb) => {
    if (file.mimetype !== 'text/csv') {
        return cb(new CustomError(400, 'Only CSV files are allowed!'), false)
    }

    const exists = await uploadService.checkFileExists(file.originalname)
    if (exists) {
        return cb(new CustomError(400, 'Same file name already exists!'), false)
    }
    return cb(null, true)
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    // 5 MB
    limits: { fileSize: 5 * 1024 * 1024 },
})

router.get('/index', uploadController.uploadGET)

router.post('/', upload.single('uploaded_file'), uploadController.uploadPOST)

module.exports = router
