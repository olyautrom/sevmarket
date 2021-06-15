const {Schema, model} = require('mongoose')

const requestSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  comment: {
    type: String,
  },
  status: {
    type: Boolean,
  }
})

module.exports = model('Request', requestSchema)
