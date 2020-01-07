const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/index');
const apiController = require('../controllers/apiController');

router.use(middleware.apiAuth);

/* GET home page. */
router.get('/', (req, res, next) => {
  return res.json({})
})
router.post('/idp', apiController.createIdentityProvider); //create identityProvider
router.get('/idp', apiController.getIdentityProvider); //get identityProvider
router.get('/idps', apiController.getIdentityProviders); //get identityProviders

// group
router.get('/group', apiController.getGroup); // get group
router.get('/group/:group_id/idp', apiController.getGroupIdentityProvider); // get groups iDP
router.get('/group/:group_id/mappers', apiController.getGroupMappers); // get groups iDP
router.get('/group/:group_id/users', apiController.getGroupUsers); // get groups iDP
router.get('/groups', apiController.getGroups); // get groups
router.post('/group', apiController.createGroup); // create group
router.delete('/group', apiController.deleteGroup); // delete group
router.patch('/group', apiController.updateGroup); // update group

//mappers
router.get('/mapper', apiController.getMapper); // get mapper
router.get('/mappers', apiController.getMappers); // get mapper
router.post('/mapper', apiController.createMapper); // create mapper
router.delete('/mapper', apiController.deleteMapper); // delete mapper
router.patch('/mapper', apiController.updateMapper); // update mapper

// token 
router.post('/verify-token', apiController.verifyToken); // varify the request
router.post('/get-token', apiController.getToken); // get the token for login/logout request



module.exports = router;
