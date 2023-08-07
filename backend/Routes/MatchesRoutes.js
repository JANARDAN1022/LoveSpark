const router = require('express').Router();
const {authenticate} = require('../Middlewares/Auth.js');
const {DeleteMatch,GetAllMatches} = require('../Controllers/MatchesController.js');



router.route('/All/:id').get(authenticate,GetAllMatches);
router.route('/Delete/:id').delete(authenticate,DeleteMatch);



module.exports = router;
