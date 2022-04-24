var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var leaveApplicationSchema = new mongoose.Schema({
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reasonForLeave: { type: String,  },
  status: { type: String,  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
  },
});

var LeaveApplication = mongoose.model(
  "LeaveApplication",
  leaveApplicationSchema
);
module.exports = LeaveApplication;
