import { cloudinary_Handler } from '../middlewares/cloudinaryHandler.js'
import Property from '../models/property.model.js'
import User from '../models/user.model.js'




export const create_New_Property = async (req, res, next) => {
    try {
        const {property_Photos} = req.body
        // const {id} = req.user
        const id = '65a790bfe69e8c1140bd2f57'

        const property_Author = await User.findById(id) 

        const uploaded_Photos = await cloudinary_Handler(property_Photos)

        
        const new_Property = await Property.create({
            ...req.body,
            property_Images: uploaded_Photos,
            owner: id
        })

        property_Author.properties.push(new_Property._id)
        await property_Author.save()

        res.status(201).json({
            msg: 'New property created',
            // new_Property
        })

    } catch (error) {
        next(error)
    }
}



export const fetch_All_Properties = async (req, res, next) => {
    try {
        const properties = await Property.find()

        res.status(201).json({
            msg: 'All properties fetched',
            properties
        })
    } catch (error) {
        next(error)
    }
}



export const fetch_Property_By_Category = async (req, res, next) => {
    try {
        const {category} = req.params

        const properties = await Property.find({category})

        res.status(201).json({
            msg: 'Property fetched by category',
            properties
        })
    } catch (error) {
        next(error)
    }
}


export const update_Property_Details = async (req, res, next) => {}



export const add_To_Whishlist = async (req, res, next) => {}



export const remove_From_Whishlist = async (req, res, next) => {}



export const fetch_All_Trips = async (req, res, next) => {}



export const fetch_All_Listed_Properties = async (req, res, next) => {}