/*
    Handling setting up and shutting down chat channel streams
*/
var express = require('express')
var router = express.Router()

var tmi = require("tmi.js");

//Mongodb TODO: production urls
var url = "mongodb://127.0.0.1:27017/twitch-analytics";
var INTERACTION_COLLECTION = "interactions";
var INTERACTION_COUNTS = "interaction-counts";

var InteractionController = require('./controllers/InteractionController');
var InteractionModel = require('./models/interaction');

var ChannelModel = require('./models/channel');
var ChannelController = require('./controllers/ChannelController');


var channelList = new Array();

//TODO: programatically get the identity object from auth
var createConnection = function(channelName) {
  var chanelTag = "#" + channelName;
  var tmiOpt = {
      options: {
          debug: true
      },
      connection: {
          reconnect: true
      },
      identity: {
          username: "wmbertrand",
          password: "oauth:pjk7wiip624zr9sstx1h1w4nn6jbga"
      },
      channels: [chanelTag]
  };
  var tmiClient = new tmi.client(tmiOpt);
  console.log('Initiated client for channel: ' + channelName);
  tmiClient.on("chat", function (channel, userstate, message, self) {
      var userId = userstate.username;
      var subs = userstate.subscriber;
      var val = message;
      var ty = 'chat';
      var d = new Date();
      var m = d.getMonth();
      var n = d.getDate();
      var y = d.getFullYear();
      var streamTag = (channel + '-/-' + m + '.' + n + '.' + y);
      //TODO save interaction here
      var obj = {
        channel: channel,
        streamID: streamTag,
        username: userstate.username,
        userid: userstate['user-id'],
        subscriber: userstate.subscriber,
        type: 'chat',
        value: message
      }
      InteractionController.createInteraction(obj);
  });
  tmiClient.on("subscription", function (channel, username, method, message, userstate) {
      var d = new Date();
      var m = d.getMonth();
      var n = d.getDate();
      var y = d.getFullYear();
      var streamTag = (channel + '-/-' + m + '.' + n + '.' + y);
      var obj = {
        channel: channel,
        username: username,
        streamID: streamTag,
        userid: null,
        type: 'sub',
        value: method
      }
      InteractionController.createInteraction(obj);
  });
  tmiClient.connect();
  channelList.push({channelName: tmiClient});
}


var handleChannels = function(channels) {
  if(channels.length == 0){
      console.log('No Channels loaded.');
      return;
  }
  console.log('Found ' + channels.length + ' Channels.')
  var chan;
  for(chan = 0; chan < channels.length; chan++){
    //post to create connection
    console.log('Time to watch: ' + channels[chan].channel);
    createConnection(channels[chan].channel);
  }
}



/*
  Connect to all channels in the channel collection
*/
router.get('/startup', function(req, res) {
  var channels = ChannelController.getAllChannels(req, handleChannels);
  res.status(200).json('Success.');
});

module.exports = router;
