import jwt from 'jsonwebtoken'
import {errorHandler} from './error.js'
import logger from './logger.js'
export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token || ''
    const refresh_token = req.cookies.refresh_token
    if (!refresh_token) {
        logger.error("No refresh token found. Logging user out.")
        return next(errorHandler(420, 'No refresh token found. Please log back in.'))
    }
    logger.info(`Attempting to verifyToken...`)
    jwt.verify(token, process.env.JWTSECRET, (err, user) => {
        if (err) { // the token has expired, try refresh
            logger.info(`Attempting to refresh token, as it has expired...`)
            jwt.verify(refresh_token, process.env.JWTREFRESH, (err, user) => {
                if (err) { // the refresh token has expired, return an error
                    logger.error(`Could not refresh access token, invalid access&refresh token`)
                    return next(errorHandler(401, 'Unauthorised, could not refresh access token, invalid access&refresh token'))
                }
                const newAccessToken = jwt.sign({id: user.id, isAdmin: user.isAdmin}, process.env.JWTSECRET, {expiresIn: process.env.TOKENEXPIRY})
                jwt.verify(newAccessToken, process.env.JWTSECRET, (err, user) => { // retry verification
                    if (err) {
                        logger.error(`Failed to verify with new access token`)
                        return next(errorHandler(401, 'Unauthorised, failed to refresh access token'))
                    } else {
                        logger.info(`Succeeded in refreshing token`)
                        req.user = user
                        res.cookie('access_token', newAccessToken, {httpOnly: true, maxAge: process.env.TOKENMAXAGE, overwrite: true})
                        next()
                    }
                })                
            })
        } else {
            req.user = user
            next()
        }
    })
}