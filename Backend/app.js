require("./MongoDb/db");
require("./MongoDb/models/Register");
require("dotenv").config();


const express = require("express");
const app = express();
const { json } = require("express");

const cors = require("cors");
const morgan = require('morgan')

const Router = require("./routes/route");

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(json());



app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(morgan('dev'));
app.use(express.static('images'));

// app.use((req,res,next)=>{
//   console.log(req.path)

//   next()
// })

app.use(Router);


app.listen(PORT, () => {
  console.log(`connection successfully on the ${PORT}`);
});
