var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var mutual = new mongoose.Schema({
    status: { type: String, },
    numPaper: {type: String,},
    

    user: {
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    },

});
var mutual = mongoose.model('mutual', mutual);
module.exports = mutual;