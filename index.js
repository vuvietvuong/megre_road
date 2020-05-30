const express = require('express');

const fs = require('fs');

const MongoClient = require('mongodb').MongoClient;
const app = express();
const url = "mongodb://localhost:27017/db";


MongoClient.connect(url, function (err, db) {
  if (err) throw err;

  const appRouter = function (app) {
    app.get("/api", function (req, res) {
      db.collection("data").find({}).toArray(function (err, results) {
        if (err) throw err;
        // let d = js2xmlparser.parse(result)
        let data = results.map(obj => {
          obj._id = obj._id.str;
          return makeXml2('osm', obj.osm)
        });
        res.send(String(data[0]))
      })
    })
  }
  appRouter(app);
  app.listen(3000, function () {
    console.log("app running on port 3000");
  });

});


function makeXml2(parentKey, obj) {
  if (!obj) return ''
  let keys = Object.keys(obj)
  let attr = ''
  let content
  if (Array.isArray(obj)) {
    return obj.map(item => {
      // console.log(item)
      return makeXml2(parentKey, item)
    }).join('')
  }
  else if (keys.some(key => {
    return typeof obj[key] === 'object'
  })) {
    if(parentKey=="bounds") console.log(typeof obj[key], content)
    attr = keys.filter(key => typeof obj[key] !== 'object').map(key => `${key}=\"${obj[key]}\"`).join(' ')
    content = keys.filter(key => typeof obj[key] === 'object').map(key=>makeXml2(key, obj[key])).join('')
  }
  else {
    attr = keys.map(key => `${key}=\"${obj[key]}\"`).join(' ')
  }
  if (content&&content.length) return `<${parentKey} ${attr}>${content}</${parentKey}>`
  else return `<${parentKey} ${attr} />`
}