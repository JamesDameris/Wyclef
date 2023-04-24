const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(8000, function() {
  console.log('App listening on port 8000!');
});