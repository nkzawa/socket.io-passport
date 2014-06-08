var Passport = require('passport').Passport;
var ioPassport = require('../');
var expect = require('chai').expect;
var IOPassport = ioPassport.Passport;


describe('session', function() {
  describe('middleware handling a request without a login session', function() {
    beforeEach(function() {
      var passport = new Passport();
      var ioPassport = new IOPassport(passport);

      this.session = ioPassport.session();
    });

    describe('after augmenting with actions', function() {
      beforeEach(function(done) {
        var self = this;
        var socket = this.socket = {};
        var req = socket.request = {};

        req._passport = {};
        req._passport.session = {};

        function next(err) {
          self.err = err;
          done();
        }

        process.nextTick(function() {
          self.session(socket, next);
        });
      });

      it('should not generate an error', function() {
        expect(this.err).to.not.exist;
      });
      it('should not set a user on the request', function() {
        expect(this.socket.request.user).to.be.undefined;
      });
    });
  });

  describe('middleware handling a request with a login session', function() {
    beforeEach(function() {
      var passport = new Passport();
      var ioPassport = new IOPassport(passport);

      this.session = ioPassport.session();
    });

    describe('after augmenting with actions', function() {
      beforeEach(function(done) {
        var self = this;
        var socket = this.socket = {};
        var req = socket.request = {};

        req._passport = {};
        req._passport.instance = {};
        req._passport.instance.deserializeUser = function(user, req, done) {
          done(null, { id: user });
        };
        req._passport.session = {};
        req._passport.session.user = '123456';

        function next(err) {
          self.err = err;
          done();
        }

        process.nextTick(function() {
          self.session(socket, next);
        });
      });

      it('should not generate an error', function() {
        expect(this.err).to.not.exist;
      });
      it('should set a user on the request', function() {
        var req = this.socket.request;
        expect(req.user).to.be.a('object');
        expect(req.user.id).to.equal('123456');
      });
      it('should maintain the session', function() {
        var req = this.socket.request;
        expect(req._passport.session).to.be.a('object');
        expect(req._passport.session.user).to.equal('123456');
      });
    });
  });

  describe('middleware handling a request with a login session using user ID 0', function() {
    beforeEach(function() {
      var passport = new Passport();
      var ioPassport = new IOPassport(passport);

      this.session = ioPassport.session();
    });

    describe('after augmenting with actions', function() {
      beforeEach(function(done) {
        var self = this;
        var socket = this.socket = {};
        var req = socket.request = {};

        req._passport = {};
        req._passport.instance = {};
        req._passport.instance.deserializeUser = function(user, req, done) {
          done(null, { id: user });
        };
        req._passport.session = {};
        req._passport.session.user = 0;

        function next(err) {
          self.err = err;
          done();
        }

        process.nextTick(function () {
          self.session(socket, next);
        });
      });

      it('should not generate an error', function() {
        expect(this.err).to.not.exist;
      });
      it('should set a user on the request', function() {
        var req = this.socket.request;
        expect(req.user).to.be.a('object');
        expect(req.user.id).to.equal(0);
      });
      it('should maintain the session', function() {
        var req = this.socket.request;
        expect(req._passport.session).to.be.a('object');
        expect(req._passport.session.user).to.equal(0);
      });
    });
  });

  describe('middleware handling a request with a login session that has been invalidated', function() {
    beforeEach(function() {
      var passport = new Passport();
      var ioPassport = new IOPassport(passport);

      this.session = ioPassport.session();
    });

    describe('after augmenting with actions', function() {
      beforeEach(function(done) {
        var self = this;
        var socket = this.socket = {};
        var req = socket.request = {};

        req._passport = {};
        req._passport.instance = {};
        req._passport.instance.deserializeUser = function(user, req, done) {
          done(null, false);
        };
        req._passport.session = {};
        req._passport.session.user = '123456';

        function next(err) {
          self.err = err;
          done();
        }

        process.nextTick(function() {
          self.session(socket, next);
        });
      });

      it('should not generate an error', function() {
        expect(this.err).to.not.exist;
      });
      it('should not set a user on the request', function() {
        expect(this.socket.request.user).to.be.undefined;
      });
      it('should remove user from the session', function() {
        var req = this.socket.request;
        expect(req._passport.session).to.be.a('object');
        expect(req._passport.session.user).to.be.undefined;
      });
    });
  });

  describe('strategy handling a login session with a custom user property', function() {
    beforeEach(function() {
      var passport = new Passport()
        , ioPassport = new IOPassport(passport);

      this.session = ioPassport.session();
    });

    describe('after augmenting with actions', function() {
      beforeEach(function(done) {
        var self = this
        var socket = this.socket = {}
        var req = socket.request = {};

        req._passport = {};
        req._passport.instance = {};
        req._passport.instance._userProperty = 'currentUser';
        req._passport.instance.deserializeUser = function(user, req, done) {
          done(null, { id: user });
        };
        req._passport.session = {};
        req._passport.session.user = '123456';

        function next(err) {
          self.err = err;
          done();
        }

        process.nextTick(function() {
          self.session(socket, next);
        });
      });

      it('should not generate an error', function() {
        expect(this.err).to.not.exist;
      });
      it('should not set a property called "user" on the request', function() {
        expect(this.socket.request.user).to.be.undefined;
      });
      it('should set a a property called "currentUser" on the request', function() {
        var req = this.socket.request;
        expect(req.currentUser).to.be.a('object');
        expect(req.currentUser.id).to.equal('123456');
      });
    });
  });

  describe('strategy handling a request with a login session but badly behaving user deserializer', function() {
    beforeEach(function() {
      var passport = new Passport();
      var ioPassport = new IOPassport(passport);

      this.session = ioPassport.session();
    });

    describe('after augmenting with actions', function() {
      beforeEach(function(done) {
        var self = this;
        var socket = this.socket = {};
        var req = socket.request = {};

        req._passport = {};
        req._passport.instance = {};
        req._passport.instance.deserializeUser = function(user, req, done) {
          done(new Error('failed to deserialize'));
        };
        req._passport.session = {};
        req._passport.session.user = '123456';

        function next(err) {
          self.err = err;
          done();
        }

        process.nextTick(function() {
          self.session(socket, next);
        });
      });

      it('should generate an error', function() {
        expect(this.err).to.be.an.instanceof(Error);
      });
      it('should not set a user on the request', function() {
        expect(this.socket.request.user).to.be.undefined;
      });
    });
  });

  describe('strategy handling a request without an initialized passport', function() {
    beforeEach(function() {
      var passport = new Passport();
      var ioPassport = new IOPassport(passport);

      this.session = ioPassport.session();
    });

    describe('after augmenting with actions', function() {
      beforeEach(function(done) {
        var self = this;
        var socket = this.socket = {};
        var req = socket.request = {};

        function next(err) {
          self.err = err;
          done();
        }

        process.nextTick(function() {
          self.session(socket, next);
        });
      });

      it('should generate an error', function() {
        expect(this.err).to.be.an.instanceof(Error);
      });
      it('should not set a user on the request', function() {
        expect(this.socket.request.user).to.be.undefined;
      });
    });
  });
});
