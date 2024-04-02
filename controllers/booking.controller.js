import Booking from '../models/booking.model.js'
import Property from '../models/property.model.js'
import User from '../models/user.model.js'
import stripePackage from "stripe";
import { config } from "dotenv";
import {
  modify_Date_Format,
  total_Booking_Amount,
} from "../utils/stripeUtils.js";


config();
const stripe = new stripePackage(process.env.STRIPE_SECRET);



export const stripe_Checkout_Session = async (req, res, next) => {
  const { current_Property, booking_Dates, adultGuests, childrenGuests } =
    req.body;
  const {id: logged_In_User_Id} = req.user
  // console.log("Booking Data: ", req.body);

  const final_Booking_Dates = modify_Date_Format(booking_Dates);

  const final_Booking_Price = total_Booking_Amount(
    booking_Dates,
    current_Property.price
  ) 

  const metadata_Properties = {
    property_Id: current_Property._id,
    booking_Start_Date: final_Booking_Dates[0],
    booking_End_Date: final_Booking_Dates[1],
    customer_Id: logged_In_User_Id,
    adults: adultGuests,
    children: childrenGuests,
    booking_Price: final_Booking_Price/100
  };

  const line_items = [
    {
      price_data: {
        currency: "inr",
        product_data: {
          name: current_Property.title,
          images: [current_Property.property_Images[0].url],
          description: `Booking dates- ${final_Booking_Dates[0]} to ${final_Booking_Dates[1]}`,
        },
        unit_amount: final_Booking_Price,
      },
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    // payment_method_types: ["card"],
    line_items: line_items,
    metadata: metadata_Properties,
    payment_intent_data: {
      metadata: metadata_Properties,
    },
    mode: "payment",
    success_url: `http://localhost:5173/success`,
  });

  res.status(201).json({ url: session.url });
};



export const new_Booking = async (booking_Details) => {
  const {
    property_Id,
    adults,
    customer_Id,
    booking_Price,
    booking_Start_Date,
    children,
    booking_End_Date,
  } = booking_Details;


  const create_Booking = await Booking.create({
    propertyId: property_Id,
    customerId: customer_Id,
    checkIn: booking_Start_Date,
    checkOut: booking_End_Date,
    totalPrice: booking_Price,
    guests: {
      adults: adults,
      children: children
    }
  })

  
}



export const fetch_Latest_Booking = async (req, res, next) => {
  const most_Recent_Booking = await Booking.findOne().sort({ createdAt: -1 }).exec();

  res.status(201).json({
    msg: 'Property booked successfully',
    most_Recent_Booking
  })
}



export const fetch_All_User_Bookings = async (req, res, next) => {
  try {
    const {id: logged_In_User} = req.user

    const users_Bookings = await Booking.find({
      customerId: logged_In_User,
    }).populate({
      path: "propertyId",
      populate: {
        path: "owner",
      },
    });    

    res.status(201).json({
      msg: 'Logged in users booking',
      users_Bookings
    })
  } catch (error) {
    next(error)
  }
}




export const logged_In_User_Hosted_Properties = async (req, res, next) => {
  try {
    const {id: userId} = req.user

    const logged_In_User = await User.findById(userId)

    const booked_Properties = await Promise.all(
      logged_In_User.properties.map(async (property) => {
        const property_Bookings = await Booking.find({
          propertyId: property._id,
        }).populate({
          path: "propertyId",
          populate: {
            path: "owner",
          },
        }).populate({
          path: 'customerId'
        })

        return property_Bookings.length > 0
          // ? { ...property._doc, bookings: property_Bookings }
          ? { ...property._doc,  property_Bookings }
          : null;
      })
    );        


    const filter_Booked_Properties = booked_Properties.filter(property => property !== null)

    res.status(201).json({
      msg: 'Hosted properties fetched',
      filter_Booked_Properties
    })
  } catch (error) {
    next(error)
  }
}
