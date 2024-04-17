import {Router} from 'express'
import { add_To_Whishlist, all_Properties_From_Whishlist, authenticate_User, edit_User_Info, fetch_All_Users, login_User, logout_User, register_User, remove_From_Whishlist } from '../controllers/user.controller.js'
import {verify_Token} from '../middlewares/verifyToken.js'

const router = Router()



router.post('/add-whishlist', verify_Token,  add_To_Whishlist)
router.post('/register', register_User)
router.post('/login', login_User)
router.get('/all-users', fetch_All_Users)
router.get('/whishlist', verify_Token, all_Properties_From_Whishlist)
router.delete('/remove-whishlist', verify_Token, remove_From_Whishlist)
router.put('/update-user', verify_Token, edit_User_Info)
router.get('/logout', logout_User)
router.get('/authenticate', verify_Token, authenticate_User)


export default router