var http = require('http');
var express = require('express')
var router = express.Router()

router.get('/list', function(req, res) {
  if(!req.query.chanel) {
    res.status(400).json('Error: Invalid request. Channel required');
  }
  if(!req.query.authToken) {
    res.status(400).json('Error: Invalid request. authToken required');
  }
  console.log('Getting subs for channel: ' + req.query.chanel);
  var subPath = '/channels/' + req.query.chanel + '/subscriptions';
  var auth = req.query.authToken;
  return http.get({
    host: 'api.twitch.tv/kraken',
    path: subPath,
    headers: {
      'Accept': 'application/vnd.twitchtv.v3+json',
      'Authorization': auth
    }
  }, function(response) {
    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      var parsed = JSON.parse(body);
      res.send(parsed);
    });

  });

});

module.exports = router
