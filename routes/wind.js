const express = require('express');
const config = require('../config.js');
const queries = require('../queries.js');

const router = express.Router();

router.get('/', function(req, res, next) {
  // GET /wind route
  queries.getWind(req, res);
});

router.post('/', async function(req, res, next) {
  // POST /wind route
  let wind = await queries.getWindFromSource();
  queries.addWindEntry(wind, req, res);
})

router.delete('/', async function(req, res, next) {
  // DELETE /wind route
  queries.deleteOldEntries(req, res);
})

module.exports = router;
