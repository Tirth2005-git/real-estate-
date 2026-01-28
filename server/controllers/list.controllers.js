import Advertisement from "../models/advertisement.model.js";
import { ErrorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";
import { delimages } from "./fileuplds.controller.js";
export async function listController(req, res, next) {
  try {
    if (req.user.userid !== req.params.id) {
      return next(ErrorHandler(403, "Can only create your own listings"));
    }

    const {
      title,
      listingType,
      propertyType,
      description,
      bhk,
      area,
      images,
      location,
      status,
      features,
      price,
      specialOffer,
      listedBy,
      userref,
    } = req.body;

    if (
      !title ||
      !listingType ||
      !propertyType ||
      !description ||
      !price ||
      !area ||
      !location
    ) {
      return next(ErrorHandler(400, "Missing required fields"));
    }

    const newlisting = new Listing({
      title: title.trim(),
      listingType: listingType.toLowerCase(),
      propertyType: propertyType.toLowerCase(),
      description: description.trim(),

      bhk: bhk || null,
      area: Number(area),

      images: images || [],

      location: {
        locality: location.locality.trim().toLowerCase(),
        address: location.address.trim(),
      },

      status: status ? status.toLowerCase() : "available",
      features: features || [],

      price: Number(price),
      specialOffer: specialOffer ? specialOffer.trim() : "",

      listedBy: {
        userId: listedBy.userId,
        role: listedBy.role,

        ...(listedBy.dealerType && { dealerType: listedBy.dealerType }),

        ...(listedBy.companyName && {
          companyName: listedBy.companyName.trim(),
        }),
        name: listedBy.name.trim(),
        contact: {
          phone: listedBy.contact.phone.trim(),
          email: listedBy.contact.email.trim(),
        },
      },

      userref: userref,
    });

    await newlisting.save();

    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      newlisting,
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(
        ErrorHandler(409, "Listing with similar data already exists"),
      );
    }

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return next(ErrorHandler(400, errors.join(", ")));
    }

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
      return next(ErrorHandler(403, "You can only update your own listings!"));
    }

    let newimgarr = [];
    let text_data = JSON.parse(req.body["text-data"]);
    let imagestodel = JSON.parse(req.body["imgstodel"]);
    let newimgs = JSON.parse(req.body["newimgs"]);
    let price = parseInt(req.body["price"]);
    const listingid = JSON.parse(req.body["listingid"]);
    const specialOffer = req.body["specialoffer"]
      ? JSON.parse(req.body["specialoffer"]).trim()
      : "";

    const listing = await Listing.findById(listingid);
    if (!listing) {
      return next(ErrorHandler(404, "Listing not found"));
    }

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

    const updateData = {
      title: updatedtextdata.title?.trim() || listing.title,
      listingType:
        updatedtextdata.listingType?.toLowerCase() || listing.listingType,
      propertyType:
        updatedtextdata.propertyType?.toLowerCase() || listing.propertyType,
      description: updatedtextdata.description?.trim() || listing.description,

      bhk: updatedtextdata.bhk || listing.bhk,
      area: updatedtextdata.area ? Number(updatedtextdata.area) : listing.area,

      images: newimgarr.length > 0 ? newimgarr : listing.images,

      specialOffer: specialOffer || "",

      features: updatedtextdata.features || [],

      status: updatedtextdata.status?.toLowerCase() || listing.status,

      location: {
        locality:
          updatedtextdata.locality?.trim().toLowerCase() ||
          listing.location?.locality,
        address: updatedtextdata.address?.trim() || listing.location?.address,
      },

      listedBy: {
        userId: listing.listedBy.userId,
        role: listing.listedBy.role,
        dealerType: listing.listedBy.dealerType,
        companyName: listing.listedBy.companyName,
        name: updatedtextdata.name?.trim() || listing.listedBy.name,
        contact: {
          email:
            updatedtextdata.email?.trim() || listing.listedBy.contact.email,
          phone:
            updatedtextdata.phone?.trim() || listing.listedBy.contact.phone,
        },
      },

      price: (price > 1000 && price) || listing.price,
    };

    const updatedlist = await Listing.findByIdAndUpdate(
      listingid,
      { $set: updateData },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      updatedlist,
    });
  } catch (err) {
    console.error("Update listing error:", err);

    // Handle validation errors
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return next(ErrorHandler(400, errors.join(", ")));
    }

    next(ErrorHandler(500, err.message));
  }
}

export async function browseList(req, res, next) {
  try {
    let filters = { status: "available" };

    const {
      listingType,
      propertyType,
      bhk,
      locality,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      listedByRole,
      dealerType,
      Features,
      ...otherFilters
    } = req.body;

    // ===== Listings Filters =====
    if (listingType) filters.listingType = listingType.toLowerCase();
    if (propertyType) filters.propertyType = propertyType.toLowerCase();
    if (bhk) filters.bhk = bhk;

    if (locality) {
      filters["location.locality"] = locality.toLowerCase();
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    if (minArea || maxArea) {
      filters.area = {};
      if (minArea) filters.area.$gte = Number(minArea);
      if (maxArea) filters.area.$lte = Number(maxArea);
    }

    if (listedByRole) {
      filters["listedBy.role"] = listedByRole.toLowerCase();
      if (listedByRole === "dealer" && dealerType) {
        filters["listedBy.dealerType"] = dealerType.toLowerCase();
      }
    }

    if (Features && Array.isArray(Features) && Features.length > 0) {
      filters.features = { $in: Features };
    }

    for (const key in otherFilters) {
      if (otherFilters[key] && otherFilters[key].toString().trim()) {
        filters[key] = otherFilters[key];
      }
    }

    delete filters.propertyCategory;

    // 🔹 Fetch Listings
    const listings = await Listing.find(filters)
      .sort({ createdAt: -1 })
      .limit(50);

    // 🔹 Fetch Builder Ads (based only on locality + propertyType)
    let ads = [];
    if (locality && propertyType) {
      ads = await Advertisement.find({
        location: locality,
        projectType: propertyType,
      })
        .sort({ createdAt: -1 })
        .limit(10);
    }

    res.status(200).json({
      success: true,
      count: listings.length,
      listings,
      ads,
    });
  } catch (err) {
    console.error("Browse error:", err);

    if (err.name === "CastError") {
      return next(ErrorHandler(400, "Invalid search parameters"));
    }

    next(ErrorHandler(500, "Search failed. Please try again."));
  }
}
