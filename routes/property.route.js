import {Router} from 'express'
import {verify_Token} from '../middlewares/verifyToken.js'
import { create_New_Property, fetch_All_Properties, fetch_Property_By_Category, fetch_Single_Property, property_Filters, search_Property } from '../controllers/property.controller.js'


const router = Router()


router.post('/new-property', create_New_Property)
router.get('/all-properties', fetch_All_Properties)
router.get('/search', search_Property)
router.get('/single-property/:propertyId', fetch_Single_Property)
router.get('/filters', property_Filters)
router.get('/:category', fetch_Property_By_Category)



export default router