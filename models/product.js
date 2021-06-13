const {Schema, model} = require('mongoose')

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  mainImage: {
    type: String
  },
  images: {
    type: Array
  },
  ingredients: {
    type: String,
    required: true
  },
  package: {
    type: String,
    required: true
  },
  conditions: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
  },
  page: {
    type: String,
    required: true
  }
})

module.exports = model('Product', productSchema)