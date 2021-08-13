const { string } = require("joi");
const mongoose = require("mongoose");
const { campgroundShema } = require("../schema");
const Review = require("./review");
const User = require("./user");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});
//to convert campground stringifgy in index.ejs
const opts={toJSON:{virtuals:true}};

const CampgroundSchema = new Schema({
  title: String,
  image: [ImageSchema],
  geometry: {
    coordinates: {
      type: [Number],
      required: true,
    },
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
  },
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
},opts);
CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
  return `<a href="/campgrounds/${this._id}">${this.title}</a><p>${this.description}</p>`;
})


CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
