const express =require('express')
const router=express.Router({mergeParams:true});
const catchAsync = require('../utility/catchAsync');
const ExpressError = require('../utility/ExpressError');
const Campground = require('../model/compground')
const Review = require('../model/review')
const {validateReview,isLoggedin,isReviewAuthor}=require('../middleware')
const review=require('../controller/review')


router.post('/',isLoggedin, validateReview, catchAsync(review.createReview))

router.delete('/:reviewId',isLoggedin,isReviewAuthor, catchAsync(review.deleteReview))

module.exports=router;