import { errorHandler } from "../utils/error.js"
import QRCode from 'qrcode'

export const generate = async (req, res, next) => {
    const { text } = req.body
    if (!text) {
        return next(errorHandler(400, "No text was provided to convert to QR code."))
    }
    try {
        const qrDataUrl = await QRCode.toDataURL(text)
        res.status(200).json({ qrCode: qrDataUrl })
    } catch (error) {
        next(error)
    }
}