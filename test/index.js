var Passport = require('passport').Passport
  , passport = require('../')
  , expect = require('chai').expect
  , IOPassport = passport.Passport;


describe('socket.io-passport', function() {
  beforeEach(function() {
    this.passport = new IOPassport(new Passport());
  });

  it('should create initialization middleware', function() {
    var initialize = this.passport.initialize();
    expect(initialize).to.be.a('function');
    expect(initialize.length).to.equal(2);
  });

  it('should create session restoration middleware', function() {
    var session = this.passport.session();
    expect(session).to.be.a('function');
    expect(session.length).to.equal(2);
  });
});
