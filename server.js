var app = require('./server-config.js');
// var dumb = require('./dumb-tests');

var port = process.env.PORT || 4568;

app.listen(port);

console.log('Server now listening on port ' + port);


// dumb();