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

    let newimgarr = [];
    let text_data = JSON.parse(req.body["text-data"]);
    let imagestodel = JSON.parse(req.body["imgstodel"]);
    let newimgs = JSON.parse(req.body["newimgs"]);
    let price = parseInt(req.body["price"]);
    const listingid = JSON.parse(req.body["listingid"]);
    const specialOffer = JSON.parse(req.body["specialoffer"]).trim();
    const listing = await Listing.findById(listingid);

    let updatedtextdata = {};
    Object.keys(text_data).forEach((key) => {
      if (text_data[key] && text_data[key].toString().trim()) {
        updatedtextdata[key] = text_data[key];
      }
    });

    if (imagestodel.length > 0) {
      const idsToDelete = imagestodel.map((img) => img.public_id);

      let images = listing.images;
      images = images.filter((img) => !idsToDelete.includes(img.public_id));
      await delimages(...imagestodel);
      newimgarr.push(...images);
    }
    if (newimgs.length > 0) {
      newimgarr.push(...newimgs);
    }
    const updatedlist = await Listing.findByIdAndUpdate(
      listingid,
      {
        $set: {
          title: updatedtextdata.title?.toLowerCase() || listing.title,
          listingType:
            updatedtextdata.listingType?.toLowerCase() || listing.listingType,
          propertyType:
            updatedtextdata.propertyType?.toLowerCase() || listing.propertyType,
          description:
            updatedtextdata.description?.toLowerCase() || listing.description,
          images: newimgarr.length > 0 ? newimgarr : listing.images,
          specialOffer: specialOffer.trim() ? specialOffer : "",
          features: updatedtextdata.features?.toLowerCase() || listing.features,
          status: updatedtextdata.status?.toLowerCase() || listing.status,
          address: {
            state:
              updatedtextdata.state?.toLowerCase() || listing.address.state,
            city: updatedtextdata.city?.toLowerCase() || listing.address.city,
            zipcode:
              updatedtextdata.zipcode?.toLowerCase() || listing.address.zipcode,
            streetAddress:
              updatedtextdata.streetAddress?.toLowerCase() ||
              listing.address.streetAddress,
          },
          listedBy: {
            name: updatedtextdata.name?.toLowerCase() || listing.listedBy.name,
            contact: {
              email: updatedtextdata.email || listing.listedBy.contact.email,
              phone: updatedtextdata.phone || listing.listedBy.contact.phone,
            },
          },
          price: (price > 1000 && price) || listing.price,
        },
      },
      { new: true }
    );

  

    res.status(201).json({ success: true, updatedlist });
  } catch (err) {
    console.log(err);

    next(ErrorHandler(500, err.message));
  }
}
