var express = require('express');
var router = express.Router();
var MongoClien = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const mkdirp = require('mkdirp');

const url = 'mongodb://localhost:27017/test';
// Database Name
const dbName = 'user-data';

/* GET home page. */
//the path for the restaurant
router.get("/rest/:restId", function(req, res, next) {
  console.log("the path is:" + req.originalUrl)
  var path = req.originalUrl;
  var restaurantID = path.split('/')[2];
  var uploadPath = "/upload/" + restaurantID
  console.log("ID is " + restaurantID);
  res.render('index', { id : restaurantID , upload : uploadPath} );
});


//the path to restaurant and the specific table
router.get('/rest/:restId/table/:tableId', function(req, res, next) {
  console.log("the path is:" + req.originalUrl)
  var path = req.originalUrl;
  var restaurantID = path.split('/')[2];
  var tableID = path.split('/')[4];
  res.render('client', { restaurantID: restaurantID, tableID: tableID });
});


// Use connect method to connect to the server
MongoClien.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  client.close();
});

router.post('/send_order/:restaurantID', function(req, res, next){
  var inserted = req.body;
  var restaurantID = req.originalUrl.split("/")[2]
  var db_path = 'Order/'+restaurantID;
  MongoClien.connect(url, function(err, db) {
    assert.equal(null, err);
    var collection = db.db('Menu-data').collection(db_path)
    collection.insertOne(inserted, function(err, result) {
      assert.equal(null, err);
      console.log('New Order Inserted');
      db.close();
    });
  });
  res.status(200).end();
});


router.get('/get-data/:restID', function(req, res, next) {
  var path = req.originalUrl;
  var restID = path.split('/')[2]
  var resultArray = [];
  var comment_numb = 0
  MongoClien.connect(url, function(err, db) {
    assert.equal(null, err);
    var db_path = 'Menu/' + restID
    var collection = db.db('Menu-data').collection(db_path);
    var cursor = collection.find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      var myJSON = JSON.stringify(resultArray);
      console.log(resultArray);
      db.close();
      //res.render('index', {loveme: "", comments: resultArray});
      res.send(myJSON);
    });
  });
});


const upload = multer({
  dest: "./public/images"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

var image_numb = 0

router.post("/upload/:uploadID", upload.single("avatar"), (req, res) => {
  console.log("upload path is: " + req.originalUrl);
  var uploadPath = req.originalUrl;
  var restaurantID = uploadPath.split("/")[2]
  var item = {
    name: req.body.name,
    ingredients: req.body.ingredients,
    price: req.body.price
  };
  var db_path = 'Menu/'+restaurantID;
  MongoClien.connect(url, function(err, db) {
    assert.equal(null, err);
    var collection = db.db('Menu-data').collection(db_path);
    collection.insertOne(item, function(err, result) {
      assert.equal(null, err);
      console.log('New Item Inserted');
      db.close();
    });
  });
  const tempPath = req.file.path;
  console.log(tempPath);
  const targetPath = path.join(__dirname, "./public/images");
  console.log(targetPath);
  console.log(req.file.originalname);
  if (path.extname(req.file.originalname).toLowerCase() === ".png") {
    //make a new directory to store the images of this restaurant
    mkdirp("public/images/" +restaurantID+"/", function(err) {
      fs.rename(tempPath, "public/images/" +restaurantID+"/" + item.name + ".png", err => {
        image_numb+=1;
        if (err) {
          res
          .status(403).contentType("text/plain")
          .end("File error")
        }
        else{
          res.redirect("/rest/" + restaurantID);
        };
      });
    });
  } else {
    fs.unlink(tempPath, err => {
      if (err) return err;
      res
      .status(403)
      .contentType("text/plain")
      .end("Only .png files are allowed!");
    });
  }
});

router.get("/listen_orders/:restaurantID", function(req, res, next){
  var resultArray = [];
  var restaurantID = req.originalUrl.split("/")[2];
  var db_path = "Order/"+restaurantID;
  MongoClien.connect(url, function(err, db) {
    assert.equal(null, err);
    var collection = db.db('Menu-data').collection(db_path)
    var cursor = collection.find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(JSON.stringify(doc));
    }, function() {
      var myJSON = JSON.stringify(resultArray);
      console.log(resultArray);
      db.close();
      res.send(myJSON);
    });
  });
})

module.exports = router;
