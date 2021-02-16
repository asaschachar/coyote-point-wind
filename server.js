const config = require('./config.js')
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const wind = require("./routes/wind");
const lastUpdated = require("./routes/last-updated");
const path = require('path');
const pg = require("pg");
const PORT = (config.NODE_ENV === 'production')
  ? config.HEROKU_PORT
  : config.SERVER_PORT;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/wind", wind);
app.use("/api/last_updated", lastUpdated);

app.use("/api", (req, res) => {
  res.status(200).send('API is running')
});

if (config.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

console.log(`Heroku Port: ${config.HEROKU_PORT}`);
app.listen(PORT, () =>
  console.log(`Server is listening on port ${PORT}`)
);
