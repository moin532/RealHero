const express = require("express");
const router = express.Router();

const {
  LoginUser,
  Register,
  getSingleUser,
  GetAlluser,
  sendOtp,
  VerifyOtp,
  LoadUser,
  updateUser,
  adminUserRequest,
  requestUser,
  updateUserRequestStatus,
  blockUser,
  unblockUser,
  deleteUser,
  updateRemindSalah,
  SalahTime,
  myuploadVoiceNote,
  RegisterSimpleUser,
} = require("../controller/userController");
const { authMiddle, authorizeRoles } = require("../middleware/auth");
const { uploadVoiceNote } = require("../controller/voiceNoteController");

router.route("/login").post(LoginUser);
router.route("/register").post(Register);
router.route("/register/simple").post(RegisterSimpleUser);
router.route("/updtae/user/:id").post(updateUser);

router.route("/request").post(authMiddle, requestUser);
router.route("/update/salah").post(authMiddle, updateRemindSalah);
router.route("/my/salah").post(SalahTime);

router.route("/admin/user/:id").get(getSingleUser);
router.route("/admin/users").get(GetAlluser);
router.route("/status/change/:id").put(updateUserRequestStatus);
router.route("/admin/users/request").get(authMiddle, adminUserRequest);
router.route("/block/:userId").put(authMiddle, blockUser);
router.route("/unblock/:userId").put(authMiddle, unblockUser);
router.route("/delete/user/:userId").delete(authMiddle, deleteUser);

router.route("/me").get(authMiddle, LoadUser);

router.route("/my/voice").post(authMiddle, myuploadVoiceNote);

module.exports = router;
