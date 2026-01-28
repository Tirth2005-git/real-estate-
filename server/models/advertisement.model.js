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
        "andheri",
        "bandra",
        "borivali",
        "dadar",
        "goregaon",
        "malad",
        "powai",
        "thane",
        "chembur",
        "kandivali",
        "juhu",
        "santacruz",
        "lower Parel",
        "worli",
        "colaba",
        "vile Parle",
        "dahisar",
        "mira Road",
        "bhandup",
        "mulund",
        "vikhroli",
        "ghatkopar",
        "kurla",
        "sion",
        "matunga",
      ],
    },
    projectType: {
      type: String,
      required: true,
      enum: ["residential", "commercial"],
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
