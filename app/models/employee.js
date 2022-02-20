var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var employeeSchema = new mongoose.Schema({
    username: { type: String },
    nom: { type: String },

    prenom: { type: String },
    email: { type: String, unique: true },
    password: { type: String },

    classEmp: { type: String },
    matricule: { type: String },

    leaveApplication: [
        { type: Schema.Types.ObjectId, ref: "LeaveApplication" }
    ],
    sanction: [

        { type: Schema.Types.ObjectId, ref: "sanction" }
    ]

});
var Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;