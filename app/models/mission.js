var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var ordreMission = new mongoose.Schema({
    objectifMission: { type: String, required: true },
    destination: { type: String, required: true },
    dateDepart: { type: Date, required: true },
    dateRetour: { type: Date, required: true },
    dateValidation: { type: String },
    status: { type: String, required: true },
    coutdejuner: { type: Number },
    coutdiner: { type: Number },
    couthebergement: { type: Number },
    couttransport: { type: Number },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    },

});
var mission = mongoose.model('mission', ordreMission);
module.exports = mission;