const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const hobbySchema = new Schema {
  
}

const Hobby = mongoose.model("Hobby", hobbySchema);
module.exports = Hobby;