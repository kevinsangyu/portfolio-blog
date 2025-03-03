import jwt from 'jsonwebtoken'
import {errorHandler} from './error.js'
export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token
    const refresh_token = req.cookies.refresh_token
    if (!token || !refresh_token) {
        return next(errorHandler(401, 'Unauthorised, access_token or refresh_token not found'))
    }
    jwt.verify(token, process.env.JWTSECRET, (err, user) => {
        if (err) { // the token has expired, try refresh
            jwt.verify(refresh_token, process.env.JWTREFRESH, (err, user) => {
                if (err) { // the refresh token has expired, return an error
                    return next(errorHandler(401, 'Unauthorised, could not refresh access token, invalid access&refresh token'))
                }
                const newAccessToken = jwt.sign({id: user.id, isAdmin: user.isAdmin}, process.env.JWTSECRET, {expiresIn: 8})
                jwt.verify(newAccessToken, process.env.JWTSECRET, (err, user) => { // retry verification
                    if (err) {
                        return next(errorHandler(401, 'Unauthorised, failed to refresh access token'))
                    } else {
                        req.user = user
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