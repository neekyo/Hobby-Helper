const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatSchema = new Schema({

})

const Chat = mongoose.model("Chat", chatSchema)
module.exports = Chat;  