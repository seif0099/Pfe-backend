var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var employeeSchema = new mongoose.Schema({
    username: { type: String, required: true },
    nom: { type: String, required: false },

    prenom: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    classEmp: { type: String, required: false },
    matricule: { type: String, required: false },

    leaveApplication: [
        { type: Schema.Types.ObjectId, ref: "LeaveApplication" }
    ],

});
var Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;