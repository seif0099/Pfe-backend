var mongoose = require("mongoose");
const promotion = require("./promotion");
var Schema = mongoose.Schema;

var employeeSchema = new mongoose.Schema({
  username: { type: String, required: true },
  nom: { type: String, required: true },

  prenom: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  poste: { type: String, required: true },

  matricule: { type: String, required: true },
  service: { type: String, required: true },
  tel: { type: String, required: true },
  sitFam: { type: String, required: true },
  adresse: { type: String, required: true },
  dateEmb: { type: Date, required: true },
  accountStatus: { type: String, required: true },
  imageProfile: { type: String },
  state: { type: Boolean },

  leaveApplication: [
    {
      type: Schema.Types.ObjectId,
      ref: "LeaveApplication",
    },
  ],
  sanction: [
    { type: Schema.Types.ObjectId, ref: "sanction" },
  ],
  promotion: [
    { type: Schema.Types.ObjectId, ref: "promotion" },
  ],
  mission: [
    { type: Schema.Types.ObjectId, ref: "mission" },
  ],
  mutual: [{ type: Schema.Types.ObjectId, ref: "mutual" }],
  SuppHours: [
    { type: Schema.Types.ObjectId, ref: "SuppHours" },
  ],
  pointage: [
    { type: Schema.Types.ObjectId, ref: "pointage" },
  ],
  rapport: [
    { type: Schema.Types.ObjectId, ref: "rapport" },
  ],
  Mutation: [
    { type: Schema.Types.ObjectId, ref: "Mutation" },
  ],
  notifications: [
    { type: Schema.Types.ObjectId, ref: "Notification" },
  ],
  demande: [
    { type: Schema.Types.ObjectId, ref: "Demande" },
  ],
});
var Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
