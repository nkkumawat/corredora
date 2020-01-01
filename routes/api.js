var express = require('express');
var router = express.Router();
var middleware = require('../middlewares/index');
var apiController = require('../controllers/apiController');

router.use(middleware.apiAuth);

/* GET home page. */
router.get('/', (req, res, next) => {
  return res.json({})
})
router.post('/idp', apiController.createIdentityProvider); //create identityProvider
router.get('/group', apiController.getGroup); // get group
router.post('/group', apiController.createGroup); // create group
router.post('/mapper', apiController.createMapper); // create mapper
router.post('/verify-token', apiController.verifyToken); // varify the request
router.post('/get-token', apiController.getToken); // get the token for login/logout request



module.exports = router;
