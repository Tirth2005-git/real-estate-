import mongoose from "mongoose";
const listmodel = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  listingType: {
    type: String,
    required: true,
    trim: true,
    enum: ["rent", "sale"],
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  propertyType: {
    type: String,
    required: true,
    trim: true,
  },
  images: {
    type: [
      {
        imageurl: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
  },
  address: new mongoose.Schema(
    {
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      streetAddress: { type: String, required: true, trim: true },
      zipcode: { type: String, required: true, trim: true },
    },
    { _id: false }
  ),
  status: {
    type: String,
    required: true,
    trim: true,
  },
  features: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
 
  },
  specialOffer: {
    type: String,
    trim: true,
  },
  listedBy: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      phone: {
        type: String,
        required: true,
        trim:true
      },
      email: {
        type: String,
        required: true,
        trim: true,
      },
    },
  },
  userref: {
    type: String,
    required: true,
    trim:true
  },
});
const Listing = mongoose.model("Listings", listmodel);
export default Listing;
