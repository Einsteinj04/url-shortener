const mongoose = require('mongoose')

const urlSchema = mongoose.Schema({
  url:{
    type: String
  }
})

module.exports  = mongoose.model('url', urlSchema);
