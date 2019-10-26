var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });


  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'index'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});

router.get('/minimum_wage', function(req, res, next) {
  res.render('minimum_wage', { title: 'Information about minimum wage' });

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'minimum wage'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});

router.get('/working_hour', function(req, res, next) {
  res.render('working_hour', { title: 'working hours information' });

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'working hour'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});

router.get('/pay_slip', function(req, res, next) {
  res.render('pay_slip', { title: 'Pay Slips information' });

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'pay slip'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});

router.get('/superannuation', function(req, res, next) {
  res.render('superannuation', { title: 'superannuation information' });
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'superannuation'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});

router.get('/pay_rate_level', function(req, res, next) {
  res.render('pay_rate_level', { title: 'pay rate information' });

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'pay rate level'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});

router.get('/pay_raise_visu', function(req, res, next) {
  res.render('pay_raise_visu', { title: 'pay raise information' });

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'pay raise visualization'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});

router.get('/weekly_leave_visu', function(req, res, next) {
  res.render('weekly_leave_visu', { title: 'weekly leave information' });

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'weekly leave visualization'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});

router.get('/annual_leave', function(req, res, next) {
  res.render('annual_leave', { title: 'Annual leave information' });

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'annual leave'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});

router.get('/annual_bonus', function(req, res, next) {
  res.render('annual_bonus', { title: 'Annual bonus information' });

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'annual bonus'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});

router.get('/sick_leave', function(req, res, next) {
  res.render('sick_leave', { title: 'Sick leave entitlement information' });

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'sick leave'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});

router.get('/infographics_epic1', function(req, res, next) {
  res.render('infographics_epic1', { title: 'Infographics' });

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'infographic epic1'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});

router.get('/infographic_epic2', function(req, res, next) {
  res.render('infographic_epic2', { title: 'Infographics' });

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'infographic epic2'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});

router.get('/infographic_epic3', function(req, res, next) {
  res.render('infographic_epic3', { title: 'Infographics' });

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'infographic epic3'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});

router.get('/contract_termination', function(req, res, next) {
  res.render('contract_termination', { title: 'Contract Termination Page' });

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'contact termination'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});

router.get('/industrial_action', function(req, res, next) {
    res.render('industrial_action', { title: 'Industrial Action Page' });

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'industrial action'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});

router.get('/redundancy', function(req, res, next) {
  res.render('redundancy', { title: 'redundancy Page' });

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'redundancy'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});

router.get('/resignation', function(req, res, next) {
  res.render('resignation', { title: 'resignation Page' });

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'resignation'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});

router.get('/unfair_dismissal_case', function(req, res, next) {
  res.render('unfair_dismissal_case', { title: 'Unfair Dismissal Case Page' });

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'unfair dismissal case'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});

router.get('/unfair_dismissal', function(req, res, next) {
  res.render('unfair_dismissal', { title: 'Unfair Dismissal Page' });

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'unfair dismissal'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});

router.get('/injury_visualisation', function(req, res, next) {
  res.render('injury_visualisation', { title: 'visualisation Page' });

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'injury visualization'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});
router.get('/external_links', function(req, res, next) {
  res.render('external_links', { title: 'External Link Page' });

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var whereStr = {"PageName":'external links'};  //
    var updateStr = {$inc: { "count" : 1 }};
    dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("successfully updated");
      db.close();
    });
  });
});

module.exports = router;
