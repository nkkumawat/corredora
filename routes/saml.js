var express = require('express');
var router = express.Router();
var samlController = require('../controllers/samlController')
var passport = require('../utils/passport');

/* GET home page. */
router.get('/:realmName/login', samlController.initLogin);

router.post("/:realmName/assert", samlController.initAuth, samlController.passportAuth, samlController.assertionLogin)

router.get('/:realmName/metadata.xml', samlController.metaData);
router.post('/:realmName/metadata.xml', (req, res) => {
  return res.redirect("/hello");
} );

module.exports = router;
