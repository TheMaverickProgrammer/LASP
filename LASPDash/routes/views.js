var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/reports', function(req, res, next) {
 res.render('views/report', { title: 'LASP - Overall Status Report' });
});

module.exports = router;
