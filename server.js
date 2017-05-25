var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.set('views', './');
app.use('/src', express.static('./dist'));
app.use(express.static('./public'));
app.get('/', function (req, res) {
  res.render('index');
});

app.listen(3000, function () {
  console.log('Server running at http://localhost:3000/');
});