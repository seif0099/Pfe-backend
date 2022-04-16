var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var pointageSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },

  user: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
  },
});

var Pointage = mongoose.model(
  "Pointage",
  pointageSchema
);
module.exports = Pointage;
