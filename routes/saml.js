const express = require('express');
const router = express.Router();
const samlController = require('../controllers/samlController')
const passport = require('../utils/passport');

/* GET home page. */
router.get('/:realmName/login', samlController.initLogin);
router.get('/:realmName/logout', samlController.logout);

router.post("/:realmName/assert", samlController.initAuth, samlController.passportAuth, samlController.assertionLogin)

router.get('/:realmName/metadata.xml', samlController.metaData);

module.exports = router;
