var express = require('express');
var router = express.Router();

/* GET alerts page. */
router.get('/alerts', function(req, res, next) {
 res.render('alerts/config', { title: 'LASP - Configure Alerts' });
});

module.exports = router;
