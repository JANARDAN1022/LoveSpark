const router = require('express').Router();
const {authenticate} = require('../Middlewares/Auth.js');
const {AddSwipe} = require('../Controllers/SwipeController.js');


router.route('/AddSwipe').post(authenticate,AddSwipe);




module.exports = router;