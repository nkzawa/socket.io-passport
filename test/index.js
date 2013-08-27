var passport = require('../')
  , expect = require('chai').expect;


describe('socket.io-passport', function() {
  it('should create initialization middleware', function() {
    var initialize = passport.initialize();
    expect(initialize).to.be.a('function');
    expect(initialize.length).to.equal(2);
  });

  it('should create session restoration middleware', function() {
    var session = passport.session();
    expect(session).to.be.a('function');
    expect(session.length).to.equal(2);
  })
});
