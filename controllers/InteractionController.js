var http = require('http');
var Interaction = require('../models/interaction');

/*
    Create a new Interaction
    Save the Interaction in the database
*/
var createInteraction = function(req) {
  var interaction = new Interaction(req);
  interaction.save(function(err, ia) {
    if(err) {
      return;
    }
    else{
      return ia;
    }
  });
}

module.exports = {
  createInteraction: (req) => {
    createInteraction(req);
  },
};
