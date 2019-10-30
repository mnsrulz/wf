const express = require('express')
const app = express()
var _wf = require('./wf');

app.set('view engine', 'pug')
var isRebuilding = false;
var lastCacheDate = '';
var lastCacheError = '';
const NodeCache = require("node-cache");
const myCache = new NodeCache();

app.get('/', async function (req, res) {
  res.redirect('/category/');
})

app.get('/category/:categoryId?', async function (req, res) {
  //'46145'; //for living sets
  // categoryId = '1868409'; //for tv stands
  //categoryId='413893'; //for sectionals and sofas

  //  var result = await _wf.ff(req.params.categoryId || 46145);
  var result = myCache.get('keys' + (req.params.categoryId || 46145));
  if (!result)
    rebuildCache()
  res.render('index', {
    data: result, context: {
      lastCacheDate,
      lastCacheError
    }
  })

})

app.get('/refresh', async function (req, res) {
  var f = isRebuilding;
  rebuildCache()
  res.render('rebuild', { data: f })
})

function rebuildCache() {
  if (isRebuilding) {
    console.log('caching is in progress')
  } else {
    isRebuilding = true
    setTimeout(async function () {
      try {
        lastCacheError = '';
        //myCache.flushAll();
        var result1 = await _wf.ff(46145);
        myCache.set("keys46145", result1, 10000);
        var result2 = await _wf.ff(1868409);
        myCache.set("keys1868409", result2, 10000);
        var result3 = await _wf.ff(413893);
        myCache.set("keys413893", result3, 10000);
        lastCacheDate = new Date().toJSON()
      } catch (error) {
        console.log('Rebuild error: ' + error);
        lastCacheError = error;
      } finally {
        isRebuilding = false;
      }
    }, 100);
    console.log('rebuild cache complete')
  }
}

app.listen(process.env.PORT || 3000)