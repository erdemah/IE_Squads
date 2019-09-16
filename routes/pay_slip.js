var express = require('express');
var router = express.Router();

/* GET minimum_wage page. */
router.get('/minimum_wage', function(req, res, next) {
    res.render('minimum_wage', { title: 'minimum_wage' });
});

module.exports = router;