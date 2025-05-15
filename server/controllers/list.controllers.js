import { ErrorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";
import { delimages } from "./fileuplds.controller.js";
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

      const newlisting = new Listing({
        title: title.toLowerCase(),
        listingType: listingType.toLowerCase(),
        propertyType: propertyType.toLowerCase(),
        description: description.toLowerCase(),
        images,
        specialOffer: specialOffer ? specialOffer.toLowerCase() : undefined,
        features: features.toLowerCase(),
        status: status.toLowerCase(),
        address: {
          state: state.toLowerCase(),
          city: city.toLowerCase(),
          zipcode: zipcode.toLowerCase(),
          streetAddress: streetAddress.toLowerCase(),
        },
        listedBy: {
          name: name.toLowerCase(),
          contact: {
            email,
            phone: phone,
          },
        },
        price: parseInt(price),
        userref,
      });

      await newlisting.save();

      res.status(201).json({ success: true, newlisting });
    } else {
      return next(ErrorHandler(403, "Can only create your own listings"));
    }
  } catch (err) {
    console.log(err.message);

    next(ErrorHandler(500, err.message));
  }
}
export async function deleteList(req, res, next) {
  try {
    if (req.params.id !== req.user.userid) {
      return next(ErrorHandler(403, "you can only delete yours listing!!"));
    }

    const listings = await Listing.findById(req.body.listingid);
    if (!listings) {
      return next(ErrorHandler(404, "Listing doesn't exists"));
    }

    const imagestodel = Array.from(listings.images);
    await delimages(...imagestodel);
    await Listing.findByIdAndDelete(req.body.listingid);
    res.status(201).json({ success: true });
  } catch (err) {
    next(ErrorHandler(500, err.message));
  }
}

export async function updateList(req, res, next) {
  try {
    if (req.params.id !== req.user.userid) {
      return next(ErrorHandler(403, "you can only update yours listing!!"));
    }

    /*const listings = await Listing.findById(req.body.listingid);
    if (!listings) {
      return next(ErrorHandler(404, "Listing doesn't exists"));
    }*/
    console.log(req.body);

    res.status(201).json({ success: true });
  } catch (err) {
    next(ErrorHandler(500, err.message));
  }
}
