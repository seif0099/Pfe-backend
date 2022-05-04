var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sanctionSchema = new mongoose.Schema({
    reasonForSanction: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    },

});


var sanction = mongoose.model("sanction", sanctionSchema);
module.exports = sanction;