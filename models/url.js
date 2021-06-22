var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const urlSchema  = new Schema({
    shortCode: {
        type: String,
        required: true,
        unique: true
    },
    longUrl: {
        type: String,
        required: true
    },
    lastAccessed: { type: Date, expires: 3600*24*30*6, default: Date.now },
},{
    timestamps: true
});


module.exports = mongoose.model('Url', urlSchema);