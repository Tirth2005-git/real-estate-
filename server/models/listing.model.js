import mongoose from "mongoose";
const listmodel = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  listingType: {
    type: String,
    required: true,
  },
  propertyType: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  address: {
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },

    streetAddress: {
      type: String,
      required: true,
    },
    zipcode: {
      type: String,
      required: true,
    },
  },
  status: {
    type: String,
    required: true,
  },
  features: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  listedBy: {
    name: {
      type: String,
      required: true,
    },
    contact: {
      phone: {
        type: Number,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
  },
});
const Listing = mongoose.model("Listings", listmodel);
export default Listing;
