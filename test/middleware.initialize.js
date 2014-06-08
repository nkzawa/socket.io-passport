var Passport = require('passport').Passport;
var ioPassport = require('../');
var expect = require('chai').expect;
var IOPassport = ioPassport.Passport;


describe('initialize', function() {
  describe('middleware', function() {
    beforeEach(function() {
      var passport = new Passport();
      var ioPassport = new IOPassport(passport);

      passport.deserializeUser(function(obj, done) {
        done(null, { id: obj });
      });
      this.initialize = ioPassport.initialize();
    });

    describe('when handling a request without a session', function() {
      beforeEach(function(done) {
        var self = this;
        var socket = this.socket = {request: {}};

        function next(err) {
          self.err = err;
          done();
        }
        process.nextTick(function() {
          self.initialize(socket, next);
        });
      });

      it('should not generate an error', function() {
        expect(this.err).to.not.exist;
      });
      it('should set internal passport on the request', function() {
        var req = this.socket.request;
        expect(req._passport).to.be.a('object');
        expect(req._passport.instance).to.be.an.instanceof(Passport);
        expect(req._passport.session).to.be.a('object');
      });
    });

    describe('when handling a request with a session', function() {
      beforeEach(function(done) {
        var self = this;
        var socket = this.socket = {request: {session: {}}};

        function next(err) {
          self.err = err;
          done()
        }
        process.nextTick(function() {
          self.initialize(socket, next)
        });
      });

      it('should not generate an error', function() {
        expect(this.err).to.not.exist;
      });
      it('should initialize a passport within the session', function() {
        expect(this.socket.request.session.passport).to.be.a('object');
      });
      it('should set internal passport on the request', function() {
        var req = this.socket.request;
        expect(req._passport).to.be.a('object');
        expect(req._passport.instance).to.be.an.instanceof(Passport);
        expect(req._passport.session).to.be.a('object');
      });
    });

    describe('when handling a request with a session containing passport data', function() {
      beforeEach(function(done) {
        var self = this;
        var socket = this.socket = {};
        var req = socket.request = {};
        req.session = {};
        req.session.passport = {};
        req.session.passport.user = '123456'

        function next(err) {
          self.err = err;
          done();
        }
        process.nextTick(function () {
          self.initialize(socket, next);
        });
      });

      it('should not generate an error', function() {
        expect(this.err).to.not.exist;
      });
      it('should maintain passport within the session', function() {
        var req = this.socket.request;
        expect(req.session.passport).to.be.a('object');
        expect(req.session.passport.user).to.be.a('string');
      });
      it('should set internal passport on the request', function() {
        var req = this.socket.request;
        expect(req._passport).to.be.a('object');
        expect(req._passport.instance).to.be.an.instanceof(Passport);
        expect(req._passport.session).to.be.a('object');
      });
    });
  });
});
