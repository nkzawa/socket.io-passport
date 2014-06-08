socket.io-passport
==================
[![Build Status](https://travis-ci.org/nkzawa/socket.io-passport.png?branch=master)](https://travis-ci.org/nkzawa/socket.io-passport)

[Passport](https://github.com/jaredhanson/passport) middleware for Socket.IO.

## Installation
    $ npm install socket.io-passport

## Usage
Use with [socket.io-bundle](https://github.com/nkzawa/socket.io-bundle).

```js
var passport = require('passport');
var bundle = require('socket.io-bundle');
var ioPassport = require('socket.io-passport');
var server = require('http').Server();
var io = require('socket.io')(server);

passport.deserializeUser(function(id, done) {
  done(null, {id: id, name: 'foo'});
});

io.use(bundle.cookieParser());
io.use(bundle.session({secret: 'my secret'}));
io.use(ioPassport.initialize());
io.use(ioPassport.session());

io.on('connection', function(socket) {
  console.log(socket.request.user);
});

server.listen(3000);
```

## License
MIT
