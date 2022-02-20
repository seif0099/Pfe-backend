var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sanctionSchema = new mongoose.Schema({
    reasonForSanction: { type: String, required: true },
    FromDate: { type: String, required: true },
    ToDate: { type: String, required: true },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    },

});


var sanction = mongoose.model("sanction", sanctionSchema);
module.exports = sanction;