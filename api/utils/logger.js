import winston from 'winston'
import path from 'path'
import { fileURLToPath } from 'url'

const __filname = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filname)

const logFormat = winston.format.combine(
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    winston.format.printf(({timestamp, level, message}) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`
    })
)

const logger = winston.createLogger({
    level: "info",
    format: logFormat,
    transports: [
      new winston.transports.Console(), 
      new winston.transports.File({ filename: path.join(__dirname, "../logs/error.log"), level: "error" }),
      new winston.transports.File({ filename: path.join(__dirname, "../logs/combined.log") }),
    ],
})

export default logger