var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var RapportSchema = new mongoose.Schema({
  dateAcc: { type: Date, required: true },
  place: { type: String, required: true },
  condition: { type: String,  required: true},
 
  user: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
  },
});

var Rapport = mongoose.model(
  "Rapport",
  RapportSchema
);
module.exports = Rapport;
