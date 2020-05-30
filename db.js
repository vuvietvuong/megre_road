const MongoClient = require('mongodb').MongoClient;
var fs = require('fs'),
    path = require('path'),
    xmlReader = require('read-xml'),
    xmlParser = require('xml2json')
const assert = require('assert')
var FILE = path.join(__dirname, 'map.osm');
var url = 'mongodb://localhost:27017/db';
MongoClient.connect(url, function(error,client) {
    assert.equal(null, error);
    console.log("Connected successfully to server");
    const collection = client.collection('data');
    xmlReader.readXML(fs.readFileSync(FILE), function(err, data) {
        if (err) {
          console.error(err);
        }
        else{
          var xml = data.content
          var json = JSON.parse(xmlParser.toJson(xml))
          
          collection.insert(json,function (err,res) {
            //neu xay ra loi
            if (err) throw err;
            //neu khong co loi
            console.log('ok')
        });
        }
      });
            
})


