const router = require('express').Router();
const {AddReport} = require('../Controllers/ReportController');


router.route('/AddReport').post(AddReport);



module.exports = router;