var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/reports', function(req, res, next) {
 res.render('views/report', { title: 'LASP - Status Reports' });
});

module.exports = router;
