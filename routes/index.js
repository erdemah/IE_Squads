var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/minimum_wage', function(req, res, next) {
  res.render('minimum_wage', { title: 'Information about minimum wage' });
});

router.get('/working_hour', function(req, res, next) {
  res.render('working_hour', { title: 'working hours information' });
});

router.get('/pay_slip', function(req, res, next) {
  res.render('pay_slip', { title: 'Pay Slips information' });
});

router.get('/superannuation', function(req, res, next) {
  res.render('superannuation', { title: 'superannuation information' });
});

router.get('/pay_rate_level', function(req, res, next) {
  res.render('pay_rate_level', { title: 'pay rate information' });
});

router.get('/pay_raise_visu', function(req, res, next) {
  res.render('pay_raise_visu', { title: 'pay raise information' });
});

router.get('/weekly_leave_visu', function(req, res, next) {
  res.render('weekly_leave_visu', { title: 'weekly leave information' });
});

router.get('/annual_leave', function(req, res, next) {
  res.render('annual_leave', { title: 'Annual leave information' });
});

router.get('/annual_bonus', function(req, res, next) {
  res.render('annual_bonus', { title: 'Annual bonus information' });
});

router.get('/sick_leave', function(req, res, next) {
  res.render('sick_leave', { title: 'Sick leave entitlement information' });
});

router.get('/infographics_epic1', function(req, res, next) {
  res.render('infographics_epic1', { title: 'Infographics' });
});

router.get('/infographic_epic2', function(req, res, next) {
  res.render('infographic_epic2', { title: 'Infographics' });
});

router.get('/infographic_epic3', function(req, res, next) {
  res.render('infographic_epic3', { title: 'Infographics' });
});

module.exports = router;
