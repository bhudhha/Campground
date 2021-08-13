const express = require("express");
const router = express.Router();
const User = require("../model/user");
const passport = require("passport");
const catchAsync = require("../utility/catchAsync");
const users = require("../controller/users");

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));
router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

module.exports = router;
