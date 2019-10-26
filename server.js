// this file should be run by developers when they implement this project
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Entitlement");
    var myobj =  [
        { PageName: 'annual bonus', count: 0},
        { PageName: 'annual leave', count: 0},
        { PageName: 'back top', count: 0},
        { PageName: 'contact termination', count: 0},
        { PageName: 'error', count: 0},
        { PageName: 'external links', count: 0},
        { PageName: 'index', count: 0},
        { PageName: 'industrial action', count: 0},
        { PageName: 'infographic epic2', count: 0},
        { PageName: 'infographic epic3', count: 0},
        { PageName: 'infographic epic1', count: 0},
        { PageName: 'injury visualization', count: 0},
        { PageName: 'minimum wage', count: 0},
        { PageName: 'pay raise visualization', count: 0},
        { PageName: 'pay rate level', count: 0},
        { PageName: 'pay slip', count: 0},
        { PageName: 'redundancy', count: 0},
        { PageName: 'resignation', count: 0},
        { PageName: 'sick leave', count: 0},
        { PageName: 'superannuation', count: 0},
        { PageName: 'unfair dismissal', count: 0},
        { PageName: 'unfair dismissal case', count: 0},
        { PageName: 'weekly leave visualization', count: 0},
        { PageName: 'working hour', count: 0}
    ];
    dbo.collection("SurfCount").insertMany(myobj, function(err, res) {
        if (err) throw err;
        console.log("the number of inserting: " + res.insertedCount);
        db.close();
    });
});
