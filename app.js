import express from 'express'
import {config} from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import cors from 'cors'
import userRouter from './routes/user.route.js'
import property_Router from './routes/property.route.js'
import booking_Router from './routes/booking.route.js'


// Initalizing express
const app = express()
config()


// Middlewares
app.use(express.json({limit: '10mb', extended: 'true'}))
app.use(express.urlencoded({type: '10mb', extended: 'true'}))
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))



// Route Middlewares
app.use('/api/user', userRouter)
app.use('/api/property', property_Router)
app.use('/api/booking', booking_Router)



// Error Middleware
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || 'Something went wrong'

    res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    })
})



export default app