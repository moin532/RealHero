const express = require("express");
const router = express.Router();
// const multer = require("multer");

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

const { authMiddle, authorizeRoles } = require("../middleware/auth");
const {
  createProduct,
  getAllPRoducts,
  UpdateProduct,
  dltPrd,
  getSinglePrd,
  cretePrdReview,
  getAllAdminPrd,
  getuserPosts,
  toggleLike,
} = require("../controller/myVideoController");
const upload = require("../utils/multer");

router.route("/video/new").post(authMiddle, createProduct);

router.route("/video/all").get(getAllPRoducts);
router.route("/toggle/like/:id").put(authMiddle, toggleLike);

router.route("/admin/products").get(authMiddle, getAllAdminPrd);
router.route("/admin/users/posts").get(authMiddle, getuserPosts);
router.route("/product/:id").get(getSinglePrd);

router.route("/admin/product/:id").put(UpdateProduct);
router.route("/admin/product/:id").delete(dltPrd);

router.route("/reviews").put(authMiddle, cretePrdReview);

// authMiddle , authorizeRoles("user")
module.exports = router;
