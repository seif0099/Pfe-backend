var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var MutationSchema = new mongoose.Schema({

  from: { type: String },
  to: { type: String, required: true },
  reasonForMutation: { type: String,  },
  status: { type: String,  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
  },
});

var Mutation = mongoose.model(
  "Mutation",
  MutationSchema
);
module.exports = Mutation;
