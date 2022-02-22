var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var promoSchema = new mongoose.Schema({
    oldPoste: { type: String, required: true },
    newPoste: { type: String, required: true },

    datePromo: { type: String, required: true },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    },

});
var promotion = mongoose.model('promotion', promoSchema);
module.exports = promotion;