/**
 *  Model capsel for mediacenterjs
 *
 *  Author: Jussi Vatjus-Anttila
 */

/** Module dependencies. */
var mongoose = require('mongoose');

/** import schema */
var MusicSchema = require('./schema');

var MusicModel = function(collection, options){

  var model;
  var schema;

  /**
   * Methods
   */ 
  
  /**
   * Model initialization
   */
  function init(modelName, options){
    schema = new MusicSchema(options);
    
    if( mongoose.modelNames().indexOf(modelName)>=0){
      model = mongoose.model(modelName);
    }
    else {
      model = mongoose.model(collection, schema);
    }
  }
  
  init(collection, options);
  
  /* Return model api */
  return model;
}

module.exports = MusicModel;
