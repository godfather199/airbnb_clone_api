import {Router} from 'express'
import {verify_Token} from '../middlewares/verifyToken.js'
import { create_New_Property, fetch_All_Properties, fetch_Property_By_Category } from '../controllers/property.controller.js'


const router = Router()


router.post('/new-property', create_New_Property)
router.get('/all-properties', fetch_All_Properties)
router.get('/:category', fetch_Property_By_Category)


export default router