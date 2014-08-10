var connect = require('connect');
var serveStatic = require('serve-static');
var url = require('url');
var proxy = require('proxy-middleware');

connect()
	.use(serveStatic('public'))
  .use('/bikeshare', proxy(url.parse('http://www.capitalbikeshare.com/data/stations')))
	.listen(process.env.PORT || 3000);