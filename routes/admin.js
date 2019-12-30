var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController');
var samlController = require('../controllers/samlController');
var middleware = require('../middlewares/index');

router.use(middleware.varifyRequest);

/* GET home page. */

router.get('/login', adminController.renderLogin);
router.post('/login', adminController.verifyLogin);
router.get('/signup', adminController.renderSignUp);
router.post('/signup', adminController.signUp);
router.get('/dashboard', adminController.renderDashboard);
// group routes 
router.get('/dashboard/group', adminController.renderCreateGroup); // get group create form
router.post('/dashboard/group', adminController.createGroup); // create group
router.get('/dashboard/groups', adminController.renderGroups); // get all groups
router.get('/dashboard/group/:id', adminController.renderGroup); // get group details
router.delete('/dashboard/group/:id', adminController.deleteGroup); // delete group details

// identity routes
router.get('/dashboard/group/:group_id/identity-provider', adminController.renderCreateIdentityProvider); // get group create form
router.post('/dashboard/group/:group_id/identity-provider', samlController.createIdentityProvider); //  create idp create form
router.get('/dashboard/identity-providers', adminController.renderIdentityProviders); // get all idps
router.get('/dashboard/group/:group_id/identity-provider/:id', adminController.renderIdentityProvider); // get idp

// mappers
router.get('/dashboard/group/:group_id/mapper', adminController.renderCreateMapper); // get mapper create form
router.post('/dashboard/group/:group_id/mapper', adminController.createMapper); // create mapper
router.get('/dashboard/group/:group_id/mappers', adminController.renderMappers); // get all group mappers
router.delete('/dashboard/group/:group_id/mapper/:id', adminController.deleteMapper); // delete mapper details

// users
router.get('/dashboard/group/:group_id/users', adminController.renderUsers); // get all group users

// sessions
router.get('/dashboard/group/:group_id/sessions', adminController.renderSessions); // get all group sessions

module.exports = router;
