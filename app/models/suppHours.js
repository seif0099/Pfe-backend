var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var SuppHoursSchema = new mongoose.Schema({
  fromDate: { type: String, required: true },
  date: { type: Date, required: true },
  toDate: { type: String, required: true },
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
