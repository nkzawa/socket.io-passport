
/**
 * Socket.IO-passport constructor.
 *
 * @param {Passport} passport instance to be based
 * @api public
 */

function Passport(passport) {
  this.passport = passport || require('passport');
}

/**
 * Passport's primary initialization middleware.
 *
 * Options:
 *   - `userProperty`  Property to set on `req` upon login, defaults to `user`
 *
 * @param {Object} options
 * @return {Function} middleware
 * @api public
 */

Passport.prototype.initialize = function(options) {
  var fn = this.passport.initialize(options);

  return function initialize(socket, next) {
    var req = socket.request;
    var res = req.res;

    fn(req, res, next);
  };
};

/**
 * Middleware that will restore login state from a session.
 *
 * @param {Object} options
 * @return {Function} middleware
 * @api public
 */

Passport.prototype.session = function(options) {
  var fn = this.passport.session(options);

  return function session(socket, next) {
    var req = socket.request;
    var res = req.res;

    fn(req, res, next);
  };
};


/**
 * Export default singleton.
 *
 * @api public
 */

exports = module.exports = new Passport();

/**
 * Expose constructors.
 */

exports.Passport = Passport;

