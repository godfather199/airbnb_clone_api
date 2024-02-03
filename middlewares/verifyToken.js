import jwt from 'jsonwebtoken'
import {error_Handler} from './errorHandler.js'


export const verify_Token = (req, res, next) => {
    // console.log('Inside verify_Token')
    // console.log('Token: ', req.cookies.access_token_ab)
    const token = req.cookies.access_token_ab

    if(!token) {
        return next(error_Handler(401, 'You are not authenticated'))
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) {
            return next(error_Handler(403, 'You are not authorized'))
        }

        req.user = user

        next()
    })
}