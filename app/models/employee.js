var mongoose = require("mongoose");
const promotion = require("./promotion");
var Schema = mongoose.Schema;

var employeeSchema = new mongoose.Schema({
  username: { type: String },
  nom: { type: String },

  prenom: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  postEmp: { type: String },

  classEmp: { type: String },
  matricule: { type: String },

  leaveApplication: [{ type: Schema.Types.ObjectId, ref: "LeaveApplication" }],
  sanction: [{ type: Schema.Types.ObjectId, ref: "sanction" }],
  promotion: [{ type: Schema.Types.ObjectId, ref: "promotion" }],
  mission: [{ type: Schema.Types.ObjectId, ref: "mission" }],
  mutual: [{ type: Schema.Types.ObjectId, ref: "mutual" }],
  SuppHours: [{ type: Schema.Types.ObjectId, ref: "SuppHours" }],
  pointage: [{ type: Schema.Types.ObjectId, ref: "pointage" }],
  rapport: [{ type: Schema.Types.ObjectId, ref: "rapport" }],
  Mutation: [{ type: Schema.Types.ObjectId, ref: "Mutation" }],

});
var Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
