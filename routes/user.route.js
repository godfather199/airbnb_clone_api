import {Router} from 'express'
import { fetch_All_Users, login_User, register_User } from '../controllers/user.controller.js'


const router = Router()



router.post('/register', register_User)
router.post('/login', login_User)
router.get('/all-users', fetch_All_Users)

export default router