const Product = require("../models/MyVideoModel");
const fs = require('fs');
const path = require('path');

const handleFileUpload = require("../utils/HandleFileUpload");

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
    // Check for uploaded files
    if (!req.files) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Upload files (images and video)
    const savedFiles = await handleFileUpload(req.files);

    // Add user ID to request body (from auth middleware)

    req.body.user = req.user._id;

    // Attach uploaded file data to request body
    req.body.video = savedFiles.video;
    req.body.images = savedFiles.images;

    // Create the DriversVideo document in DB
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Drivers video created successfully",
      data: product,
    });
  } catch (error) {
    console.error("File upload or save failed:", error);
    res.status(500).json({ error: "Server error during file upload or save" });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: 1 }); // 1 = ascending (oldest first)

    if (!products || products.length === 0) {
      return res.status(200).json({
        success: false,
        msg: "Products not found",
      });
    }

    return res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
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
    const product = await Product.findById({ user: req.params.id });

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

exports.toggleLike = async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.id; // assuming authentication middleware sets this

    const video = await Product.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const hasLiked = video.likedBy.includes(userId);

    if (hasLiked) {
      // Unlike
      video.likedBy = video.likedBy.filter((id) => id.toString() !== userId);
      video.likes -= 1;
    } else {
      // Like
      video.likedBy.push(userId);
      video.likes += 1;
    }

    await video.save();

    return res.status(200).json({
      success: true,
      message: hasLiked ? "Like removed" : "Video liked",
      likes: video.likes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
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

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        msg: "Authentication required to delete videos",
      });
    }
    console.log(product)

    // Check if user owns this video (optional security check)
    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        msg: "You can only delete your own videos",
      });
    }

    // Delete video file from file system if exists
    if (product.video && product.video.url) {
      const videoPath = path.join(__dirname, '..', product.video.url);
      if (fs.existsSync(videoPath)) {
        try {
          fs.unlinkSync(videoPath);
          console.log('Video file deleted:', videoPath);
        } catch (fileError) {
          console.error('Error deleting video file:', fileError);
          // Continue with deletion even if file deletion fails
        }
      } else {
        console.log('Video file not found at path:', videoPath);
      }
    }

    // Delete image files from file system if exist
    if (product.images && product.images.length > 0) {
      product.images.forEach((image) => {
        if (image.url) {
          const imagePath = path.join(__dirname, '..', image.url);
          if (fs.existsSync(imagePath)) {
            try {
              fs.unlinkSync(imagePath);
              console.log('Image file deleted:', imagePath);
            } catch (fileError) {
              console.error('Error deleting image file:', fileError);
              // Continue with deletion even if file deletion fails
            }
          } else {
            console.log('Image file not found at path:', imagePath);
          }
        }
      });
    }

    // Delete from MongoDB
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      msg: "Video and associated files successfully deleted",
    });
  } catch (error) {
    console.log('Delete error:', error);

    return res.status(500).json({
      success: false,
      err: error.message,
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

// Add comment to video
exports.addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;

    console.log(req.body, "ededed", userId)

    if (!comment || comment.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    const video = await Product.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Get user details for the comment
    const User = require("../models/userModel");
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newComment = {
      user: userId,
      name: user.name || user.email,
      comment: comment.trim(),
      createdAt: new Date(),
    };

    video.reviews.push(newComment);
    video.numOfReviews = video.reviews.length;
    await video.save();

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get comments for a video
exports.getComments = async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Product.findById(videoId).populate({
      path: "reviews.user",
      select: "name email",
    });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      comments: video.reviews,
    });
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete comment (only by comment author)
exports.deleteComment = async (req, res) => {
  try {
    const { videoId, commentId } = req.params;
    const userId = req.user._id;

    const video = await Product.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Find the comment
    const commentIndex = video.reviews.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if user is the author of the comment
    if (video.reviews[commentIndex].user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments",
      });
    }

    // Remove the comment
    video.reviews.splice(commentIndex, 1);
    video.numOfReviews = video.reviews.length;
    await video.save();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
