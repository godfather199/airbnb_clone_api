import { Schema, model } from "mongoose";


const {ObjectId} = Schema.Types


export const bookingSchema = new Schema({
    propertyId: {
        type: ObjectId,
        ref: 'property',
        required: true
    },
    customerId: {
        type: ObjectId,
        ref: 'user',
        required: true
    },
    checkIn:{
        type: String
    },
    checkOut:{
        type: String
    },
    totalPrice: {
        type: String
    },
    guests: {
        adults: {
            type: String
        },
        children: {
            type: String
        },
    }
},
{
    timestamps: true
})



export default model('booking', bookingSchema)


