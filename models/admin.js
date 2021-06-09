const {Schema, model} = require('mongoose')

const adminSchema = new Schema({
  login: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
})

module.exports = model('Admin', adminSchema)