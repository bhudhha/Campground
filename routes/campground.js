const express = require("express");
const router = express.Router();
const catchAsync = require("../utility/catchAsync");
const campgrounds = require("../controller/campgrounds");
const { isLoggedin, isAuthor, validateCampground } = require("../middleware");
var multer  = require('multer')
const {storage}=require('../cloudinary');
var upload = multer({ storage })


router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedin, 
    upload.array('image'),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );
 

  router.get("/new", isLoggedin, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedin,
    isAuthor,
    upload.array('image'),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(
    isLoggedin,
    isAuthor,
    catchAsync(campgrounds.deleteCampground)
  );


router.get(
  "/:id/edit",
  isLoggedin,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
