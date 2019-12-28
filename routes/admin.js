var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController');
var samlController = require('../controllers/samlController');
var middleware = require('../middlewares/index');

router.use(middleware.varifyRequest);

/* GET home page. */

router.get('/login', adminController.renderLogin);
router.get('/login', adminController.verifyLogin);
router.get('/signup', adminController.renderSignUp);
router.post('/signup', adminController.signUp);
router.get('/dashboard', adminController.renderDashboard);
// group routes 
router.get('/dashboard/group', adminController.renderCreateGroup); // get group create form
router.post('/dashboard/group', adminController.createGroup); // create group
router.get('/dashboard/groups', adminController.renderGroups); // get all groups
router.get('/dashboard/group/:id'); // get group details
router.delete('/dashboard/group/:id', adminController.deleteGroup); // delete group details

// identity routes
router.get('/dashboard/group/:group_id/identity-provider', adminController.renderCreateIdentityProvider); // get group create form
router.post('/dashboard/group/:group_id/identity-provider', samlController.createIdentityProvider); //  create idp create form
router.get('/dashboard/identity-providers', adminController.renderIdentityProviders); // get all idps
router.get('/dashboard/group/:group_id/identity-provider/:id', adminController.renderIdentityProvider); // get idp

module.exports = router;
