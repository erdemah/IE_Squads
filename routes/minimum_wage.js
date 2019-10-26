var express = require('express');
var router = express.Router();

/* GET minimum_wage page. */
router.get('/minimum_wage', function(req, res, next) {
    res.render('minimum_wage', { title: 'minimum_wage' });

    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Entitlement");
        var whereStr = {"PageName":'minimum wage'};  // 查询条件
        var updateStr = {$inc: { "count" : 1 }};
        dbo.collection("SurfCount").updateOne(whereStr, updateStr, function(err, res) {
            if (err) throw err;
            console.log("successfully updated");
            db.close();
        });
    });
});

module.exports = router;