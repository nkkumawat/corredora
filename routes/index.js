const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  return res.render('error', {error: "not found"});
});
router.get('/logout', adminController.logout);


module.exports = router;
