const {Schema, model} = require('mongoose')

const ingredientSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
})
module.exports = model('Ingredient', ingredientSchema)