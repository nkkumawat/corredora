var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController')
var middleware = require('../middlewares/index')

router.use(middleware.varifyRequest);

/* GET home page. */
router.get('/login', adminController.renderLogin);
router.get('/login', adminController.verifyLogin);
router.get('/signup', adminController.renderSignUp);
router.post('/signup', adminController.signUp);
router.get('/dashboard', adminController.renderDashboard);
// group routes 
router.get('/dashboard/group', adminController.renderCreateGroup); // get group create form
router.get('/dashboard/groups', adminController.renderGroups); // get all groups
router.post('/dashboard/group', adminController.createGroup); // create group

// identity routes
router.get('/dashboard/identity-provider', adminController.renderIdentityProvider); // get group create form


module.exports = router;
