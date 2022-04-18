var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var RapportSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  dateAcc: { type: Date, required: true },
  place: { type: Date, required: true },
  condition: { type: String,  },
 
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
