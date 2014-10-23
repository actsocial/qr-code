
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var index = require('./app/controllers/index');
app.get('/index', index.index);
app.get('/', index.index);

var qrcode = require('./app/controllers/qrcode');
app.get('/qrcode/generate', qrcode.generate);

var shorturl = require('./app/controllers/shorturl');
app.get('/url/new', shorturl.new);
app.get('/url/:id/edit', shorturl.show);
app.put('/url/:id', shorturl.edit);
app.del('/url/:id', shorturl.destroy);
app.post('/url', shorturl.create);

var urlgroup = require('./app/controllers/urlgroup');
app.get('/urlgroup/new', urlgroup.new);
app.get('/urlgroup/:id/edit', urlgroup.show);
app.put('/urlgroup/:id', urlgroup.edit);
app.del('/urlgroup/:id', urlgroup.destroy);
app.post('/urlgroup', urlgroup.create);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
