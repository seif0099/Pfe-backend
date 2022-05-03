var mongoose = require("mongoose");
const promotion = require("./promotion");
var Schema = mongoose.Schema;

var notificationSchema = new mongoose.Schema({
  status: { type: String ,required : true},

  type: { type: String ,required : true},
  role: { type: String ,required : true},

  leaveApplication: { type: Schema.Types.ObjectId, ref: "LeaveApplication" },
  sanction: [{ type: Schema.Types.ObjectId, ref: "sanction" }],
  promotion: [{ type: Schema.Types.ObjectId, ref: "promotion" }],
  mission: [{ type: Schema.Types.ObjectId, ref: "mission" }],
  mutual: [{ type: Schema.Types.ObjectId, ref: "mutual" }],
  SuppHours: [{ type: Schema.Types.ObjectId, ref: "SuppHours" }],
  pointage: [{ type: Schema.Types.ObjectId, ref: "pointage" }],
  rapport: [{ type: Schema.Types.ObjectId, ref: "rapport" }],
  Mutation: [{ type: Schema.Types.ObjectId, ref: "Mutation" }],
  demande: [{ type: Schema.Types.ObjectId, ref: "Demande" }],

  user: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
  },

});
var Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
