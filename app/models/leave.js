var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var leaveApplicationSchema = new mongoose.Schema({
    Leavetype: { type: String, required: true },
    FromDate: { type: String, required: true },
    ToDate: { type: String, required: true },
    Reasonforleave: { type: String, required: true },
    status: { type: String, required: true },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    },

});


var LeaveApplication = mongoose.model("LeaveApplication", leaveApplicationSchema);
module.exports = LeaveApplication;