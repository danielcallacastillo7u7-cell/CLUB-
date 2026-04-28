const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const nombre = `comprobante_${Date.now()}${path.extname(file.originalname)}`
        cb(null, nombre)
    }
    })

    const fileFilter = (req, file, cb) => {
    const tiposPermitidos = /jpeg|jpg|png|pdf/
    const extname = tiposPermitidos.test(path.extname(file.originalname).toLowerCase())
    const mimetype = tiposPermitidos.test(file.mimetype)

    if (extname && mimetype) {
        cb(null, true)
    } else {
        cb(new Error('Solo se permiten imágenes (jpg, png) o PDF'))
    }
    }

    const upload = multer({
    storage,
    fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB máximo
})

module.exports = upload