import mongoose from "mongoose";
const listmodel = new mongoose.Schema(
  {
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
    bhk: {
      type: String,
      enum: ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "Studio"],
    },
    area: {
      type: Number,
      required: true,
    },
    images: {
      type: [
        {
          imageurl: { type: String, required: true },
          public_id: { type: String, required: true },
        },
      ],
    },
    location: {
      locality: {
        type: String,
        required: true,
        enum: [
          "Andheri",
          "Bandra",
          "Borivali",
          "Dadar",
          "Goregaon",
          "Malad",
          "Powai",
          "Thane",
          "Chembur",
          "Kandivali",
          "Juhu",
          "Santacruz",
          "Lower Parel",
          "Worli",
          "Colaba",
        ],
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
    features: {
      type: [String],
      default: [],
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
      userId: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
        enum: ["user", "dealer"],
      },
      dealerType: {
        type: String,
        enum: ["individual", "agency"],
      },
      companyName: {
        type: String,
        trim: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      contact: {
        phone: {
          type: String,
          required: true,
          trim: true,
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
      trim: true,
    },
  },
  { timestamps: true },
);
const Listing = mongoose.model("Listings", listmodel);
export default Listing;
