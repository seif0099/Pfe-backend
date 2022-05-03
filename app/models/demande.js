var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var DemandeSchema = new mongoose.Schema({
  sujet: { type: String, required: true },

  user: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
  },
});

var Demande = mongoose.model(
  "Demande",
  DemandeSchema
);
module.exports = Demande;
