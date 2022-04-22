var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var SuppHoursSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  typeOfWork: { type: String,  required: true},
  status: { type: String,  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
  },
});

var SuppHours = mongoose.model(
  "SuppHours",
  SuppHoursSchema
);
module.exports = SuppHours;
