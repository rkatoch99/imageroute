const mongoose = require('mongoose')


const ImageModel = mongoose.Schema({
    name:{
        type:String
    },
    image:{
        type:String
    }
})


const Imagemodel = new mongoose.model('image',ImageModel)


module.exports = Imagemodel

