const mongoose = require('mongoose')

const user = new mongoose.Schema({
    name: { type: String },
    mail: { type: String },
    phoneno: { type: Number },
    password: { type: String }
})

const userModel = mongoose.model('userdetail',user)

module.exports = userModel