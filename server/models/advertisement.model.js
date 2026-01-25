import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema(
  {
    builderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
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
        "Vile Parle",
        "Dahisar",
        "Mira Road",
        "Bhandup",
        "Mulund",
        "Vikhroli",
        "Ghatkopar",
        "Kurla",
        "Sion",
        "Matunga",
      ],
    },
    projectType: {
      type: String,
      required: true,
      enum: ["Residential", "Commercial"],
    },
    unitTypes: [
      {
        type: String,
        required: true,
      },
    ],
    priceRange: {
      min: {
        type: Number,
        required: true,
        min: 0,
      },
      max: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    areaRange: {
      min: {
        type: Number,
        required: true,
        min: 0,
      },
      max: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    possessionDate: Date,
    reraRegistered: {
      type: Boolean,
      default: false,
    },
    reraNumber: String,
    amenities: [String],
    images: [
      {
        imageurl: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],
    brochure: {
      pdfurl: String,
      public_id: String,
    },
    projectContacts: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        phone: {
          type: String,
          required: true,
          trim: true,
        },
        email: {
          type: String,
          trim: true,
          lowercase: true,
        },
      },
    ],
  },
  { timestamps: true },
);

const Advertisement = mongoose.model("Advertisement", advertisementSchema);
export default Advertisement;
