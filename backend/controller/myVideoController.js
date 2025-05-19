const Product = require("../models/MyVideoModel");
const cloudinary = require("cloudinary");
const path = require("path");

// exports.createProduct = async (req, res) => {
//   try {
//     let images = [];
//     let videoFile = null;

//     // Handling images
//     if (req.files && req.files.images) {
//       const imagesArray = Array.isArray(req.files.images)
//         ? req.files.images
//         : [req.files.images];

//       for (let img of imagesArray) {
//         const result = await cloudinary.v2.uploader.upload(img.tempFilePath, {
//           folder: "products/images",
//         });
//         images.push({
//           public_id: result.public_id,
//           url: result.secure_url,
//         });
//       }
//     }

//     // Handling video
//     if (req.files && req.files.video) {
//       const videoFileObj = req.files.video;
//       const videoUpload = await cloudinary.v2.uploader.upload(
//         videoFileObj.tempFilePath,
//         {
//           resource_type: "video",
//           folder: "products/videos",
//         }
//       );

//       videoFile = {
//         public_id: videoUpload.public_id,
//         url: videoUpload.secure_url,
//       };
//     }

//     req.body.images = images;
//     req.body.video = videoFile;

//     req.body.user = req.user._id;

//     const product = await Product.create(req.body);

//     res.status(201).json({
//       success: true,
//       product,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(400).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

exports.createProduct = async (req, res) => {
  try {
    let images = [];

    // Handle images input
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images || [];
    }

    const imagesLinks = [];

    // Upload each image to Cloudinary
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products/images",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;

    // Handle video upload
    if (req.body.video) {
      const videoUpload = await cloudinary.v2.uploader.upload(req.body.video, {
        resource_type: "video",
        folder: "products/videos",
      });

      req.body.video = {
        public_id: videoUpload.public_id,
        url: videoUpload.secure_url,
      };
    }

    // Create product
    req.body.user = req.user.id;
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
exports.getAllPRoducts = async (req, res) => {
  try {
    const products = await Product.find({});

    if (!products) {
      return res.status(200).json({
        succes: false,
        msg: "products does not found",
      });
    }

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      err: error,
    });
  }
};

exports.getAllAdminPrd = async (req, res) => {
  try {
    const seller_id = req.seller._id;

    const products = await Product.find({ seller_id }); // Use find() to get all products

    res.status(200).json({
      success: true,
      products, // Sending an array of products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message, // Send a proper error message
    });
  }
};
exports.getuserPosts = async (req, res) => {
  try {
    const { id } = req.body.parmas;
    const products = await Product.find({ user: id }); // Use find() to get all products

    res.status(200).json({
      success: true,
      products, // Sending an array of products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message, // Send a proper error message
    });
  }
};

exports.UpdateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "product not found",
      });
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      useFindAndModify: false,
      runValidators: false,
    });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      err: error,
    });
  }
};

exports.getSinglePrd = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      succes: false,
      err: error,
    });
  }
};

exports.dltPrd = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "product not found",
      });
    }

    await product.remove();

    res.status(200).json({
      success: true,
      msg: "product successfully removed",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      succes: false,
      err: error,
    });
  }
};

exports.cretePrdReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find((elem) => {
      elem.toString() === req.user._id.toString();
    });

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      msg: "added  successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      succes: false,
      err: error,
    });
  }
};
