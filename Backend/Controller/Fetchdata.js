const Registration = require("../MongoDb/models/Register");
require("../MongoDb/models/Register");
const mongoOp = require("../MongoDb/models/Register");
const fs = require("fs")
const got = require('got');
const axios = require("axios");
const cheerio = require("cheerio");
const pretty = require("pretty");

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const ImageModel = require('../MongoDb/models/ImageModel')

const Snapdeel = require('../MongoDb/models/Snapmodel')

exports.FetchData = async (req, res) => {
  try {
    const User = await Registration.find();
    console.log(User);

    const response = [];
    User.forEach((user) => {
      response.push({
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        username: user.username,
      });
    });

    console.log(response);

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
  }
};

exports.DeleteData = async (req, res) => {
  try {
    const { _id } = req.body;

    const User = await Registration.deleteOne({ id: _id });
    console.log(User);

    res.status(200).json({ message: "data delete sucessfully.." });
  } catch (err) {
    console.log(err);
  }
};

exports.PageNo = async (req,res) => {
  try {
    const perPage = 10,page = req.params.page >= 1 ? req.params.page : 1
    // page = page - 1
    const  query =  await Registration.find().skip(perPage*page).limit(perPage)
    console.log(query)
    res.status(200).json({message:query})


  }catch (err) {
    console.log(err);
  }
};



exports.Fetching = async (req,res)=>{

  const url = "https://www.flipkart.com/search?q=mobiles&page=1";

  try {

    
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the list items in plainlist class
    const listItems = $('._3exPp9');
    // Stores data for all countries
    const countries = [];
    // Use .each method to loop through the li we selected
    listItems.each((idx, el) => {
      // console.log(el)
      // Object holding data for each country/jurisdiction
      const country = { name: "", image: "" };
      // Select the text content of a and span elements
      // Store the textcontent in the above object
      country.image= $(el).attr().src;

      country.name = $(el).attr().alt;
      // console.log(country.src)
      
      // Populate countries array with country data
      countries.push(country);
    });

    const products = await ImageModel.find({});

    res.json(products);
    // const Data =  await ImageModel.insertMany(countries)
    // console.log("data",Data)


    // Logs countries array to the console
    // console.dir(countries);
    // Write countries array in countries.json file
    // fs.writeFile("coutries.json", JSON.stringify(countries, null, 2), (err) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //   console.log("Successfully written data to file");
    // });
  } catch (err) {
    console.error(err);
  }



  // const vgmUrl= "https://www.flipkart.com/search?q=mobiles&page=1";
  // got(vgmUrl).then(response => {
  //   const dom = new JSDOM(response.body);
  //     dom.window.document.querySelectorAll('._3exPp9').forEach(link => {
  //     console.log(link.href);
  //   });
  // }).catch(err => {
  //   console.log(err);
  // });
  // const dom = new JSDOM(``, {
  //   url: "https://www.flipkart.com/mobiles/",
  //   contentType: "text/html",
  //   includeNodeLocations: true,
  //   storageQuota: 10000000
  // });
  // const f= dom.serialize("https://www.flipkart.com/mobiles/")

  // // console.log(dom)
  // console.log(f);
}

//-----------------------------------------------------------------------------------------------////


exports.Snap = async (req,res)=>{

  const url = "https://www.snapdeal.com/products/mens-tshirts-polos?sort=plrty&page=2";

  try {

    
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the list items in plainlist class
    const listItems = $('.product-image ');
    // Stores data for all countries
    const countries = [];
    // Use .each method to loop through the li we selected
    listItems.each((idx, el) => {
       console.log(el)
      // Object holding data for each country/jurisdiction
      const country = { name: "", image: "" };
      // Select the text content of a and span elements
      // Store the textcontent in the above object
      country.image= $(el).attr().srcset;

      country.name = $(el).attr().title;
      console.log(country.name)
      console.log(country.image)
      
      // Populate countries array with country data
      countries.push(country);
    });

    const products = await Snapdeel.find({});

    res.json(products);
    const Data =  await Snapdeel.insertMany(countries)
    console.log("data",Data)
    
  } catch (err) {
    console.error(err);
  }



  
}