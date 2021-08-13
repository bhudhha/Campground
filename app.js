if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const helmet = require("helmet");
const methodOverride = require("method-override");

// const { campgroundShema, reviewSchema } = require("./schema.js");
// const catchAsync = require("./utility/catchAsync");
// const ExpressError = require("./utility/ExpressError");
const User = require("./model/user");
// const Campground = require("./model/compground");
// const Review = require("./model/review");
const userRoute = require("./routes/user");
const campgroundsRoute = require("./routes/campground");
const reviewsRoute = require("./routes/reviews");
const { Session } = require("inspector");
const { contentSecurityPolicy } = require("helmet");

const MongoDBStore = require("connect-mongodb-session")(session);

const db_url=process.env.DB_URL||"mongodb://localhost:27017/yelp-camp";
mongoose.connect(db_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));

const secret=process.env.SECRET || "thisismysessionsecret";

const store = new MongoDBStore({
  uri: db_url,
  secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("SESSION SToRE ERROR", e);
});

const SessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure:true,s
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(SessionConfig));

app.use(flash());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  // console.log(req.session)
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// app.get('/fakeUser',async(req,res)=>{
//   const user=new User({email:'rkumar.jnvr@gmail.com',username:'colt'});
//   const newUser=await User.register(user,'chicken');
//   res.send(newUser);
// })
app.use("/", userRoute);
app.use("/campgrounds", campgroundsRoute);
app.use("/campgrounds/:id/reviews", reviewsRoute);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("page not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});
const port=process.env.PORT||8000
app.listen(port, () => {
  console.log(`server start ${port}`);
});
