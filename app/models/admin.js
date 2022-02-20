var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var adminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    nom: { type: String, required: true },

    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    classAdm: { type: String, required: true },
    matricule: { type: String, required: true },
    secretKey: { type: String, required: true },



});
var admin = mongoose.model('admin', adminSchema);
module.exports = admin;