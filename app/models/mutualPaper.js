var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var mutualPaper = new mongoose.Schema({
    state: { type: String, required: true },
    

    user: {
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    },

});
var mutual = mongoose.model('mutual', mutualPaper);
module.exports = mutual;