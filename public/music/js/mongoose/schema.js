var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
  
var MusicSchema = function(){
   var schema = new Schema({
    href: {type: String, required: true, unique: true, index: true},
    title: {type: String, required: true},
    format: [{type: String}],
    genre: [{type: String}],
    country: {type: String},
    album: {type: String, default: ''},
    thumb: {type: String},
    year: {type: Number},
    ranking: {type: Number, min: 0, max: 5},
    fileSize: {type: Number, min: 0},
    musicLength: {type: Number, min: 0}, //seconds
   });
   return schema;
};

module.exports = MusicSchema;

