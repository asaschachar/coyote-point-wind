const express = require('express');
const config = require('../config.js');
const queries = require('../queries.js');

const router = express.Router();

router.get('/', function(req, res, next) {
  // GET /last_updated route
  queries.getLastUpdatedDate(req, res);
});

module.exports = router;
