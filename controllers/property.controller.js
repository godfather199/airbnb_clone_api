import { cloudinary_Handler } from '../middlewares/cloudinaryHandler.js'
import Property from '../models/property.model.js'
import User from '../models/user.model.js'
import Booking from '../models/booking.model.js'



export const search_Property = async (req, res, next) => {
    // console.log('Inside search_Property controller')
    try {
        const {search_Location} = req.query
        // console.log('Location: ', search_Location)

        const result_Properties = await Property.find({
          $or: [
            {
              location: {
                $regex: search_Location,
                $options: "i",
              },
            },
          ],
        });
        // console.log('Result: ', result_Properties)
        res.status(201).json({
            msg: 'Searched location',
            result_Properties
        })
    } catch (error) {
        next(error)
    }
}



export const create_New_Property = async (req, res, next) => {
    try {
        const {property_Photos} = req.body
        const {id} = req.user

        const property_Author = await User.findById(id) 

        const uploaded_Photos = await cloudinary_Handler(property_Photos, "Airbnb_Property_Images")

        
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
    // It should take propertyId and check if there is a corresponding booking dates for that property
    
    try {
        const all_Properties = await Property.find().populate('owner')

        const properties = await Promise.all(
          all_Properties.map(async (property) => {
            const property_Bookings = await Booking.find({
              propertyId: property._id,
            });
            return { ...property._doc, bookings: property_Bookings }; 
          })
        );        

        res.status(201).json({
            msg: 'All properties fetched',
            properties
        })
        
    } catch (error) {
        next(error)
    }
}



export const fetch_Single_Property = async (req, res, next) => {
    try {
        const {propertyId} = req.params

        const property = await Property.findById(propertyId).populate('owner')

        res.status(201).json({
            msg: 'Property fetched', 
            property
        })
    } catch (error) {
        next(error)
    }
}



export const property_Filters = async (req, res, next) => {
  try {
    const { max_Distance, min_Price, max_Price } = req.query;

    const properties = await Property.find({
      price: { $gte: min_Price, $lte: max_Price },
      distance: { $lte: max_Distance }
    });

    res.status(201).json({
      msg: "Properties fetched by distance",
      properties,
    });
  } catch (error) {
    next(error);
  }
}



export const logged_In_User_Property = async (req, res, next) => {
  try {
    const {id: userId} = req.user

    const properties = await Property.find({owner: userId}).populate('owner')

    res.status(201).json({
      msg: "Logged in user's property fetched",
      properties
    })
  } catch (error) {
    next(error)
  }
}




export const update_Property_Details = async (req, res, next) => {}



export const fetch_All_Trips = async (req, res, next) => {}



export const fetch_All_Listed_Properties = async (req, res, next) => {}



export const fetch_Property_By_Category = async (req, res, next) => {
  try {
      const {category} = req.params
      // console.log('fetch_Property_By_Category params: ', category)

      const properties = await Property.find({category}).populate('owner')

      res.status(201).json({
          msg: 'Property fetched by category',
          properties
      })
  } catch (error) {
      next(error)
  }
}
