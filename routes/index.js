var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  return res.render('home', {})
});
router.get('/logout', adminController.logout);


module.exports = router;
