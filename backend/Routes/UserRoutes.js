const router = require('express').Router();
const {authenticate} = require('../Middlewares/Auth.js');
const {RegisterUser,LoginUser,logout, updateUser,LoadUser,GetAllUsers,GetUser} = require('../Controllers/UserController.js');
//const passport = require('passport');

router.route('/Register').post(RegisterUser);
router.route('/LogIn').post(LoginUser);
router.route('/Logout').get(authenticate,logout);
router.route('/Me').get(authenticate,LoadUser);
router.route('/All/:id').get(authenticate,GetAllUsers);
router.route('/:id').get(authenticate,GetUser);
router.route('/Update/:id').put(updateUser);


module.exports = router;