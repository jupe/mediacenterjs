var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
  
var MusicSchema = function(){
   var schema = new Schema({
    href: {type: String, required: true, unique: true, index: true},
    title: {type: String, required: true},
    format: [{type: String}],
    genre: [{type: String}],
    country: {type: String},
    artist: {type: String, default: 'unknown'},
    album: {type: String, default: 'unknown'},
    thumb: {type: String},
    year: {type: Number},
    ranking: {type: Number, min: 0, max: 5},
    fileSize: {type: Number, min: 0},
    duration: {type: Number, min: 0}, //seconds
    
    created_at: {type: Date, default: Date.now},
    
   });
   return schema;
};

module.exports = MusicSchema;

