import { ErrorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";

export async function listController(req, res, next) {
  try {
    if (req.user.userid === req.params.id) {
      const {
        title,
        listingType,
        propertyType,
        description,
        images,
        specialOffer,
        features,
        status,
        state,
        city,
        zipcode,
        streetAddress,
        name,
        email,
        phone,
        price,
        userref,
      } = req.body.formdata;
      console.log(images);

      const newlisting = new Listing({
        title,
        listingType,
        propertyType,
        description,
        images,
        specialOffer,
        features,
        status,
        address: {
          state,
          city,
          zipcode,
          streetAddress,
        },
        listedBy: {
          name,
          contact: {
            email,
            phone,
          },
        },
        price: parseInt(price),
        userref,
      });

      await newlisting.save();
      res.status(201).json({ success: true });
    } else {
      return next(ErrorHandler(403, "Can only create your own listings"));
    }
  } catch (err) {
    next(ErrorHandler(500, err.message));
  }
}
