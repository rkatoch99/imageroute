const mongoose = require('mongoose')


const snapdeel = new mongoose.Schema({
    name:{
        type:String
    },
    image:{
        type:String
    }
})



const Snapdeel = mongoose.model('snapdelel',snapdeel)


module.exports=Snapdeel