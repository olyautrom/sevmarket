const {Schema, model} = require('mongoose')

const infoSchema = new Schema({
  infoId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  value: {
    type: String,
    required: true
  }
})

module.exports = model('Info', infoSchema)