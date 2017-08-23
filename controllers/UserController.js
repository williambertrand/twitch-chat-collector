var http = require('http');
var User = require('../models/user');

/*
    Create a new Interaction
    Save the Interaction in the database
*/
var createUser = function(req) {
  var user = new User(req);
  user.save(function(err, ia) {
    if(err) {
      return;
    }
    else{
      return ia;
    }
  });
}

module.exports = {
  createUser: (req) => {
    createUser(req);
  },
};
