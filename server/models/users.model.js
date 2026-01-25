import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "dealer", "builder"],
      required: true,
    },

    personalContactValue: {
      type: String,
      unique: true,
      trim: true,
    },

    dealerType: {
      type: String,
      enum: ["individual", "agency"],
    },

    localities: {
      type: [String],
      default: [],
    },

    companyName: {
      type: String,
      trim: true,
    },

    companyAddress: {
      type: String,
      trim: true,
    },

    companyContactValue: {
      type: String,
      unique: true,
      trim: true,
    },

    companyDescription: {
      type: String,
      trim: true,
    },

    pfp: {
      type: String,
      default:
        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    },

    pfpid: {
      type: String,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userschema);

export default User;
