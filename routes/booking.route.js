import {Router} from 'express'
import { fetch_All_User_Bookings, fetch_Latest_Booking, stripe_Checkout_Session } from '../controllers/booking.controller.js'
import express from 'express'
import { stripe_Webhook_Handler } from '../utils/stripeWebhook.js'
import {verify_Token} from '../middlewares/verifyToken.js'


const router = Router()


router.post('/new-booking')
router.delete('/cancel-booking')
router.get('/user-bookings', verify_Token, fetch_All_User_Bookings)
router.post('/create-checkout-session', verify_Token, stripe_Checkout_Session)
router.post('/webhook', express.raw({type: 'application/json'}), stripe_Webhook_Handler)
router.get('/latest-booking', fetch_Latest_Booking)



export default router