var http = require('http');
var Channel = require('../models/channel');

/*
    Create a new Channel to track the analytics
    Save the Channel info in the database
*/
var createChannel = function(req) {
  console.log('creating channel: ' + req.channel);
  var channel = new Channel(req);
  channel.save(function(err, ia) {
    if(err) {
      console.log("Error saving: " + err);
      return;
    }
    else{
      console.log('Saved.');
      return ia;
    }
  });
}

var getAllChannels = function(req, done) {
  Channel.find({}, function(err, channels) {
      done(channels);
    });
}

var getAllChannelsForUser = function(req) {
  if(!req.username) {
    return null;
  }
  Channel.find({username: req.username}, function(err, channels) {
      return channels;
    });
}

module.exports = {
  createChannel: (req) => {
    createChannel(req);
  },
  getAllChannels: (req, done) => {
    getAllChannels(req, done);
  },
  getAllChannelsForUser: (req) => {
    getAllChannelsForUser(req);
  }
};
