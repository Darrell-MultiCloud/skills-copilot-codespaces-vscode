// create web server 

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

// create application/json parser
app.use(bodyParser.json());

var fs = require('fs');
var file = 'comments.db';
var exists = fs.existsSync(file);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

if (!exists) {
  db.run('CREATE TABLE Comments (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, comment TEXT)');
}

// GET /comments
app.get('/comments', function(req, res) {
  db.all('SELECT * FROM Comments', function(err, rows) {
    res.json(rows);
  });
});

// POST /comments
app.post('/comments', function(req, res) {
  var name = req.body.name;
  var comment = req.body.comment;
  db.run('INSERT INTO Comments (name, comment) VALUES (?, ?)', [name, comment], function(err) {
    res.json({
      id: this.lastID,
      name: name,
      comment: comment
    });
  });
});

// PUT /comments/:id
app.put('/comments/:id', function(req, res) {
  var id = req.params.id;
  var name = req.body.name;
  var comment = req.body.comment;
  db.run('UPDATE Comments SET name = ?, comment = ? WHERE id = ?', [name, comment, id], function(err) {
    res.json({
      id: id,
      name: name,
      comment: comment
    });
  });
});

// DELETE /comments/:id
app.delete('/comments/:id', function(req, res) {
  var id = req.params.id;
  db.run('DELETE FROM Comments WHERE id = ?', [id], function(err) {
    res.json({
      id: id
    });
  });
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});

// GET /comments/:id
app.get('/comments/:id', function(req, res) {
  var id = req.params.id;
  db.get('SELECT * FROM Comments WHERE id = ?', [id], function(err, row) {
    res.json(row);
  });
});