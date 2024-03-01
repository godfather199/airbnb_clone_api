import {Router} from 'express'
import { stripe_Checkout_Session } from '../controllers/booking.controller.js'



const router = Router()


router.post('/new-booking')
router.delete('/cancel-booking')
router.post('/create-checkout-session', stripe_Checkout_Session)



export default router