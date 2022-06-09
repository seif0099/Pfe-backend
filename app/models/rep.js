var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var RepSchema = new mongoose.Schema({
  reponse: { type: String },

  user: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
  },
});

var Reponse = mongoose.model("Reponse", RepSchema);
module.exports = Reponse;
