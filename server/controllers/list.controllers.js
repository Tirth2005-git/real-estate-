import { ErrorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";

export async function listController(req, res, next) {
  try {
    const listing = req.body;
    const newlisting = new Listing(listing);
    await newlisting.save();
    res.status(201).json(newlisting);
  } catch (err) {
    next(ErrorHandler(500, err.message));
  }
}
