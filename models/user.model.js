import {Schema, model} from 'mongoose'
import bcrypt from 'bcrypt'


const {ObjectId} = Schema.Types


const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  user_Avatar: {
    public_id: {
      type: String
    },
    url: {
      type: String
    },
  },
  residence: {
    type: String
  },
  hosting_Duration: {
    type: String
  },
  about: [
    {
      type: String
    }
  ],
  properties: [
    {
      type: ObjectId,
      ref: 'property'
    }
  ],
  trips: [
    {
      type: ObjectId,
      ref: 'booking'
    }
  ],
  whishlist: [
    {
      type: ObjectId,
      ref: 'property'
    }
  ],
},
{
  timestamps: true
})






userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});


// Verifying password
userSchema.methods.verify_Password = async function(user_Password) {
  return await bcrypt.compare(user_Password, this.password)
}



export default model('user', userSchema)