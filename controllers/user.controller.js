import User from '../models/user.model.js'
import Property from '../models/property.model.js'
import {error_Handler} from '../middlewares/errorHandler.js'
import jwt from 'jsonwebtoken'



export const register_User = async (req, res, next) => {
    try {
        const {email} = req.body

        const user = await User.findOne({email})

        if(user) {
            return next(error_Handler(400, 'Email already registered'))
        }

        const new_User = await User.create({...req.body})

        const {password, ...info} = new_User._doc

        res.status(201).json({
            msg: 'User registered successfully',
            info
        })
    } catch (error) {
        next(error)
    }
}



export const login_User = async (req, res, next) => {
    try {
        const {email, password} = req.body

        const user  = await User.findOne({email}).select('+password')

        if(!user) {
            return next(error_Handler(400, 'Invalid email'))
        }
        
        const compare_Password = await user.verify_Password(password)
        
        if(!compare_Password) {
            return next(error_Handler(400, 'Invalid Password'))
        }

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                "expiresIn": '2d' 
            }
        )

        const {password: userPassword, ...info} = user._doc
 
        res
        .status(201)
        .cookie('access_token_ab', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        })
        .json({
            msg: 'Login successful',
            info
        })
    } catch (error) {
        next(error)
    }
}



export const fetch_All_Users = async (req, res, next) => {
    try {
        const users = await User.find()

        res.status(201).json({
            msg: 'Fetch all users',
            users
        })
    } catch (error) {
        next(error)
    }
}



export const add_To_Whishlist = async (req, res, next) => {
    try {
        const {property_Id} = req.query
        const {id: userId} = req.user

        const logged_In_User = await User.findById(userId)
        logged_In_User.whishlist.push(property_Id)
        await logged_In_User.save()

        res.status(201).json({
            msg: 'Property Added to whishlist',
            logged_In_User
        })
    } catch (error) {
        next(error)
    }
}



export const all_Properties_From_Whishlist = async (req, res, next) => {
    try {
       const {id: userId} = req.user
       
       const { whishlist: user_Whishlist } = await User.findById(userId).select(
         "whishlist"
       );

       const properties = await Promise.all(
         user_Whishlist.map(async (item) => await Property.findById(item).populate('owner'))
       );

    //    const logged_In_User = await User.findById(userId)

    //    const properties = await Promise.all(
    //      logged_In_User.whishlist.map(async (item) => await Property.findById(item))
    //    );

       res.status(201).json({
        msg: 'Whishlist properties fetched',
        properties,
        // logged_In_User
       })

    } catch (error) {
        next(error)
    }
}




export const remove_From_Whishlist = async (req, res, next) => {
    try {
        const {property_Id} = req.query

        const {id: userId} = req.user

        const logged_In_User = await User.findById(userId)

        logged_In_User.whishlist = logged_In_User.whishlist.filter(
          (item) => item.toString() !== property_Id.toString()
        );
        await logged_In_User.save()

        res.status(201).json({
            msg: 'Property removed from whishlist',
            logged_In_User
        })

    } catch (error) {
        next(error)
    }
}