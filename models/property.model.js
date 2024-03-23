import {Schema, model} from 'mongoose'



const {ObjectId} = Schema.Types



const property_Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: [
      {
        type: String,
        required: true,
      },
    ],
    property_Images: [
      {
        public_Id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    owner: {
      type: ObjectId,
      ref: "user",
    },
    location: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    checkIn: {
      type: String,
    },
    checkOut: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);




export default model('property', property_Schema)


