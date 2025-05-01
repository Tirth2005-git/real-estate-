import mongoose from "mongoose";
const userschema = new mongoose.Schema(
  {
    username: {
      type: String,
      requires: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pfp: {
      type: String,
      default:
        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userschema);
export default User;
