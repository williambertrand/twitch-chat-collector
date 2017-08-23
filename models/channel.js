var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;

/*
    The schema for a Channel Object
*/

var ChannelSchema = Schema({
  channel: {type: String},
  username: {type: String},
  userid: {type: String},
  date: {type: Date, default: Date.now},
});

var ChannelModel = mongoose.model('Channel', ChannelSchema);
module.exports = ChannelModel;
