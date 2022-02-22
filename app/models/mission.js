var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var ordreMission = new mongoose.Schema({
    objetctMission: { type: String, required: true },
    destination: { type: String, required: true },
    dateDepart: { type: String, required: true },
    dateRetour: { type: String, required: true },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    },

});
var mission = mongoose.model('mission', ordreMission);
module.exports = mission;