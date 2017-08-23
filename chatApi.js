var tmi = require("tmi.js");
var express = require('express')
var router = express.Router()


//Mongodb
var url = "mongodb://127.0.0.1:27017/twitch-analytics";
var INTERACTION_COLLECTION = "interactions";
var CHANNEL_COLLECTION = "channels";
var INTERACTION_COUNTS = "interaction-counts";

var InteractionController = require('./controllers/InteractionController');
var InteractionModel = require('./models/interaction');

var ChannelModel = require('./models/channel');
var ChannelController = require('./controllers/ChannelController');


var options = {
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
    channels: ["#c9sneaky"]
};

var channelMap = {};

var client = new tmi.client(options);
console.log('Initiated client');

client.on("chat", function (channel, userstate, message, self) {
    var userId = userstate.username;
    var subs = userstate.subscriber;
    var val = message;
    var ty = 'chat';
    //TODO save interaction here
    var obj = {
      channel: channel,
      username: userstate.username,
      userid: userstate['user-id'],
      subscriber: userstate.subscriber,
      type: 'chat',
      value: message
    }
    InteractionController.createInteraction(obj);
});

client.on("subscription", function (channel, username, method, message, userstate) {
    console.log('NEW: SUBSCRIPTION:');
    console.log(username);
    console.log(' ');
    console.log('For Chanel:');
    console.log(channel);
    console.log('Using:');
    console.log(method);
    console.log('---------------------');
    var obj = {
      channel: channel,
      username: username,
      userid: null,
      type: 'sub',
      value: method
    }
    InteractionController.createInteraction(obj);

    //TODO save interaction here
});

var parseMessage = function(rawMessage) {
    var parsedMessage = {
        message: null,
        tags: null,
        command: null,
        original: rawMessage,
        channel: null,
        username: null
    };

    if(rawMessage[0] === '@'){
        var tagIndex = rawMessage.indexOf(' '),
        userIndex = rawMessage.indexOf(' ', tagIndex + 1),
        commandIndex = rawMessage.indexOf(' ', userIndex + 1),
        channelIndex = rawMessage.indexOf(' ', commandIndex + 1),
        messageIndex = rawMessage.indexOf(':', channelIndex + 1);

        parsedMessage.tags = rawMessage.slice(0, tagIndex);
        parsedMessage.username = rawMessage.slice(tagIndex + 2, rawMessage.indexOf('!'));
        parsedMessage.command = rawMessage.slice(userIndex + 1, commandIndex);
        parsedMessage.channel = rawMessage.slice(commandIndex + 1, channelIndex);
        parsedMessage.message = rawMessage.slice(messageIndex + 1);
    }

    if(parsedMessage.command !== 'PRIVMSG'){
        parsedMessage = null;
    }

    return parsedMessage;
}


var createConnection = function(channelName){
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
}

// Connect the client to the server..
router.get('/connect', function(req, res){
  client.connect();
  console.log('Connected Client.')
});

// Connect the client to the server..
router.get('/create', function(req, res) {
  if(!req.query.channel){
      res.status(400).json("Error, need channel name.");
  }
  else {
    createConnection(req.query.channel);
    res.status(200).json('Success');
  }
});

// Create a channel to be watched
router.get('/create-channel', function(req, res) {
  if(!req.query.channel) {
      res.status(400).json("Error, need channel name.");
  }
  if(!req.query.username) {
      res.status(400).json("Error, need channel name.");
  }
  else {
    console.log('Accepted GET for: ' + req.query)
    ChannelController.createChannel(req.query);
    res.status(200).json('Success');
  }
});

module.exports = router;
