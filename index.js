const express = require('express')
const app = express()
var _wf = require('./wf');

app.set('view engine', 'pug')

app.get('/:categoryId?', async function (req, res) {
  //'46145'; //for living sets
  // categoryId = '1868409'; //for tv stands
  //categoryId='413893'; //for sectionals and sofas
  
  var result = await _wf.ff(req.params.categoryId || 46145);

  res.render('index', { data: result })

  //res.send(result);
})
 
app.listen(process.env.PORT || 3000)