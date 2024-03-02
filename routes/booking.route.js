import {Router} from 'express'
import { stripe_Checkout_Session, stripe_Webhook_Handler } from '../controllers/booking.controller.js'
import express from 'express'


const router = Router()


router.post('/new-booking')
router.delete('/cancel-booking')
router.post('/create-checkout-session', stripe_Checkout_Session)
router.post('/webhook', express.raw({type: 'application/json'}), stripe_Webhook_Handler)



export default router