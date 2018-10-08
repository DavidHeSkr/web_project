var express = require('express');
var router = express.Router();
var MongoClien = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

const url = 'mongodb://localhost:27017/test';
// Database Name
const dbName = 'user-data';

/* GET home page. */
router.get('/', function(req, res, next) {
  var myMessgae = "fuck you all!";
  res.render('index', {loveme : "", comments:null});
});

// Use connect method to connect to the server
MongoClien.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  client.close();
});




router.get('/loveme', function(req, res, next) {
  //var myMessgae = "fuck you all!";
  //var res = res;
  console.log("fuck it");
  var resultArray = [];
  var arrayLength;
  var objectId;
  MongoClien.connect(url, function(err, db) {
    assert.equal(null, err);
    var collection = db.db('user-data').collection('Database')
    var cursor = collection.find()
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      arrayLength = resultArray.length;
      console.log(resultArray);
      var objectInserted = {loveme:0}
      if(arrayLength == 0){
        collection.insertOne({loveme: 0}, function(err, result) {
          assert.equal(null, err);
          console.log('Item inserted');
        })
      }


      else{
        collection.findOne({}, function(err, result) {
          if (err) throw err;
          console.log("new result" + result._id);
          collection.updateOne({'_id': ObjectId(result._id)}, { $set:{loveme:result.loveme+1}}, function(err, res2) {
              if (err) throw err;
              console.log("updated result" + res2);
                collection.findOne({}, function(err, result) {
                  var number = result.loveme;
                  console.log(number);
                  //res.render('index',{loveme : "I have beeeeeen loved " + number + " times", comments:null});
                  res.send("" + number);
                })
          });
        });
      }
  });
  //res.render('index', {message : myMessgae});*/
});
});

router.get('/fuckme', function(req, res, next) {
  //var myMessgae = "fuck you all!";
  //var res = res;
  console.log("fuck it");
  var resultArray = [];
  var arrayLength;
  var objectId;
  MongoClien.connect(url, function(err, db) {
    assert.equal(null, err);
    var collection = db.db('user-data').collection('Database2')
    var cursor = collection.find()
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      arrayLength = resultArray.length;
      console.log(resultArray);
      var objectInserted = {loveme:0}
      if(arrayLength == 0){
        collection.insertOne({loveme: 0}, function(err, result) {
          assert.equal(null, err);
          console.log('Item inserted');
        })
      }


      else{
        collection.findOne({}, function(err, result) {
          if (err) throw err;
          console.log("new result" + result._id);
          collection.updateOne({'_id': ObjectId(result._id)}, { $set:{loveme:result.loveme+1}}, function(err, res2) {
              if (err) throw err;
              console.log("updated result" + res2);
                collection.findOne({}, function(err, result) {
                  var number = result.loveme;
                  console.log(number);
                  //res.render('index',{loveme : "I have beeeeeen fucked " + number + " times!!!!!!!", comments:null});
                  res.send("" + number);
                })
          });
        });
      }
  });
  //res.render('index', {message : myMessgae});*/
});
});

router.get('/get-data', function(req, res, next) {
  var resultArray = [];
  var comment_numb = 0
  MongoClien.connect(url, function(err, db) {
    assert.equal(null, err);
    var collection = db.db('user-data').collection('Database3')
    var cursor = collection.find();
    var comments = "["
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
      var title = doc.title;
      var content = doc.content;
      var author = doc.author;
      var single_comment = {
        title:title,
        content:content,
        author:author
      }
      var myJSON = JSON.stringify(single_comment);
      comment_numb += 1;
      comments = comments + myJSON + ",";
    }, function() {
      if(comments.length>1){
        comments = comments.substring(0,comments.length-1) + "]"
      }
      console.log(resultArray);
      db.close();
      //res.render('index', {loveme: "", comments: resultArray});
      res.send(comments);
    });
  });
});



  router.post('/insert', function(req, res, next) {
    var item = {
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    };
    MongoClien.connect(url, function(err, db) {
    assert.equal(null, err);
    var collection = db.db('user-data').collection('Database3')
      collection.insertOne(item, function(err, result) {
      assert.equal(null, err);
      console.log('Item inserted');
      db.close();
    });
  });
  res.send("R U OK?");
});

module.exports = router;
