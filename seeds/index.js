const mongoose = require("mongoose");
const Campground = require('../model/compground')
const cities = require('./cities')
const {places,descriptors}=require('./seedHelper');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});
// array[Math.floor(Math.random()*array.length)];

const sample=array=>array[Math.floor(Math.random()*array.length)];

const seeDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i <= 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp = new Campground({
          //it must you user id
            author:'61051285052ace573c716d44',
            location: `${cities[random1000].city} ${cities[random1000].state}`,
           title:`${sample(descriptors)} ${sample(places)}`,
           description:"  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat recusandae obcaecati, optio dicta ullam sequi odio dolore pariatur velit amet distinctio sit officia et dolorum suscipit minus esse a qui!",
           price:price,
           geometry:{
             type:"Point",
             coordinates:[
               cities[random1000].longitude,
               cities[random1000].latitude
             ]
           },
           image:[
            {
              url: 'https://res.cloudinary.com/best-place/image/upload/v1628011813/hzych9btwf1s7r3vleys.png',
              filename: 'y8r1mdtmfjb6jwulwhf8'
            },
            {
              url: 'https://res.cloudinary.com/best-place/image/upload/v1628011813/hzych9btwf1s7r3vleys.png',
              filename: 'ypdrrt4ore7h8amj4u4p'
            }
          ]
        })
        await camp.save();
    }
}
seeDB().then(()=>{
    mongoose.connection.close();
});