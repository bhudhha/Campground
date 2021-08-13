const { campgroundShema,reviewSchema } = require('./schema.js')
const ExpressError = require('./utility/ExpressError');
const Campground = require('./model/compground')
const Review =require('./model/review');
module.exports.isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
      //store url
    req.session.returnTo=req.originalUrl;
    req.flash("error", "You must be Login");
    return res.redirect("/login");
  }
  next();
};

module.exports.isAuthor=async(req,res,next)=>{
  const {id}=req.params;
  const campground=await Campground.findById(id);
  if(!campground.author.equals(req.user._id)){
      req.flash('error','You do not have premission to do that');
     return res.redirect(`/campgrounds/${id}`);
  }
   next();
}
module.exports.validateCampground = (req, res, next) => {

  const { error } = campgroundShema.validate(req.body);

  if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400)
  }
  else {
      next();
  }
}
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400)
  }
  else {
      next();
  }
}

module.exports.isReviewAuthor=async(req,res,next)=>{
  const {id,reviewId}=req.params;
  const review=await Review.findById(reviewId);
  if(!review.author.equals(req.user._id)){
      req.flash('error','You do not have premission to do that');
     return res.redirect(`/campgrounds/${id}`);
  }
   next();
}