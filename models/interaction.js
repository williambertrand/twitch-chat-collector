var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;

/*
    The schema for an Interaction Object
*/

var InteractionSchema = Schema({
  channel: {type: String},
  username: {type: String},
  userid: {type: String},
  subscriber: {type: Boolean},
  date: {type: Date, default: Date.now},
  type: {type: String, required: true, default: 'null'},
  value: {type:String}
});

var InteractionModel = mongoose.model('Interaction', InteractionSchema);
module.exports = InteractionModel;
