const express = require('express');
const app = express();

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  // res.send('Hello World!');
  console.log(__dirname);
  res.sendFile(__dirname + '/ToDo.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
