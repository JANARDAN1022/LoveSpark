const router = require('express').Router();
const {authenticate} = require('../Middlewares/Auth.js');
const {RegisterUser,LoginUser,logout, updateUser,LoadUser,GetAllUsers,GetUser} = require('../Controllers/UserController.js');
//const passport = require('passport');

router.route('/Register').post(RegisterUser);
router.route('/LogIn').post(LoginUser);
router.route('/Logout').get(logout);
router.route('/Me/:id').get(LoadUser);
router.route('/All/:id').get(GetAllUsers);
router.route('/:id').get(GetUser);
router.route('/Update/:id').put(updateUser);


module.exports = router;