var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var AdminPointageSchema = new mongoose.Schema({
  nom: { type: String, },
  prenom: { type: String, },
  fromDate: { type: String,  },
  toDate: { type: String,  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
  },
});

var AdminPointage = mongoose.model(
  "AdminPointage",
  AdminPointageSchema
);
module.exports = AdminPointage;
