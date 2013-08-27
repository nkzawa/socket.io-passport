var passport = require('passport');


exports.initialize = function() {
  var fn = passport.initialize();

  return function initialize(socket, next) {
    var req = socket.request
      , res = req.res;

    fn(req, res, next);
  };
};

exports.session = function() {
  var fn = passport.session();

  return function session(socket, next) {
    var req = socket.request
      , res = req.res;

    fn(req, res, next);
  };
};

