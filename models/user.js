var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;

var UserSchema = Schema({
  username: {type: String},
  password: {type: String},
  email: {type: String},
  userid: {type: String},
  twitchUserId: {type: String},
  twitchAccessToken: {type: String},
  tiwtchRefreshToken: {type: String},
  date: {type: Date, default: Date.now},
  lastLogin: {type: Date, default: Date.now}
});

var UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
