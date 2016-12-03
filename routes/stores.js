var express = require('express');
var router = express.Router();
var stores = require('../models/stores');

/* GET home page. */
router.get('/Stas', function(req, res, next) {
	stores.get()
    .then(result => res.json(result))
    .catch(err => res.send(err));
});

module.exports = router;
