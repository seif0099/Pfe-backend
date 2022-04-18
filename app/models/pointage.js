var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var pointageSchema = new mongoose.Schema({
 
pDate: { type: Date, required: true },
  
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
