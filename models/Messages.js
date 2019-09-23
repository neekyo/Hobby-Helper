const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const messagesSchema = new Schema {

}

const Messages = mongoose.model("Messages", messagesSchema);
module.exports = Messages;