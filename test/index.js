var Passport = require('passport').Passport
  , ioPassport = require('../')
  , expect = require('chai').expect
  , IOPassport = ioPassport.Passport;


describe('socket.io-passport', function() {
  beforeEach(function() {
    this.ioPassport = new IOPassport(new Passport());
  });

  it('should create initialization middleware', function() {
    var initialize = this.ioPassport.initialize();
    expect(initialize).to.be.a('function');
    expect(initialize.length).to.equal(2);
  });

  it('should create session restoration middleware', function() {
    var session = this.ioPassport.session();
    expect(session).to.be.a('function');
    expect(session.length).to.equal(2);
  });
});
