const {Schema, model} = require('mongoose')

const newsSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  newsImage: {
    type: String
  },
  annotation: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
})

module.exports = model('News', newsSchema)