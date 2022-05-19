const config = require("./config.js");
const fetch = require("node-fetch");
const Pool = require("pg").Pool;

const ONE_DAY = 1000 * 60 * 60 * 24;
const SEVEN_DAYS = ONE_DAY * 7;
const SIXTY_DAYS = ONE_DAY * 60;

let connectionString =
  config.NODE_ENV === "production" || config.SIMULATE_PRODUCTION
    ? config.DATABASE_URL
    : `postgresql://${config.PG_USER}:${config.PG_PASSWORD}@${config.PG_HOST}:${config.PG_PORT}/${config.PG_DATABASE}`;

const pool = new Pool({
  connectionString,
  ...((config.NODE_ENV === "production" || config.SIMULATE_PRODUCTION) && {
    ssl: { rejectUnauthorized: false },
  }),
});

const getLastUpdatedDate = (req, res) => {
  pool.query(
    `
   SELECT last_received as last_updated
   FROM weather
   ORDER BY last_received DESC
   LIMIT 1;
  `,
    (error, results) => {
      if (error) {
        throw error;
      }

      let lastUpdated =
        results.rows.length > 0 ? Number(results.rows[0].last_updated) : null;

      res.status(200).json({
        last_updated: lastUpdated,
      });
    }
  );
};

const getWind = (req, res) => {
  const lastWeek = +new Date() - SEVEN_DAYS;
  pool.query(
    `
   SELECT *
   FROM weather
   WHERE last_received > ${lastWeek}
   ORDER BY last_received ASC
  `,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

const getWindForSail = (req, res, startTime, endTime) => {
  pool.query(
    `
   SELECT wind, wind_direction, last_received
   FROM weather
   WHERE last_received > ${startTime}
   AND last_received < ${endTime}
   ORDER BY last_received ASC
  `,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

const getGustForSail = (req, res, startTime, endTime) => {
  pool.query(
    `
   SELECT wind_gust, wind_gust_date
   FROM weather
   WHERE wind_gust_date > ${startTime}
   AND wind_gust_date < ${endTime}
   ORDER BY wind_gust_date ASC
  `,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

const addWindEntry = (data, request, response) => {
  pool.query(
    `INSERT INTO weather
      (
        wind,
        wind_direction,
        wind_gust,
        wind_gust_date,
        temp,
        temp_feels_like,
        barometer,
        rain,
        last_received,
        humidity
      )
     VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      data.wind,
      data.windDirection,
      data.gust,
      data.gustAt,
      data.temperature,
      data.temperatureFeelLike,
      data.barometer,
      data.rain,
      data.lastReceived,
      data.humidity,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(201)
        .send(`Wind entry added for time: ${data.lastReceived}`);
    }
  );
};

const getWindFromSource = () => {
  const windPromise = new Promise((resolve, reject) => {
    fetch(
      "https://www.weatherlink.com/embeddablePage/getData/f385707047f74d3d861bb398535cb070",
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "no-cache",
          pragma: "no-cache",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer:
          "https://www.weatherlink.com/embeddablePage/show/8ca3628b0cb24408bddddc7a166efd63/slim",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
      }
    )
      .then((res) => res.json())
      .then((json) => resolve(json));
  });

  return windPromise;
};

const deleteOldEntries = (req, res) => {
  const lastTwoMonths = +new Date() - SIXTY_DAYS;
  pool.query(
    `
   DELETE FROM weather
   WHERE last_received < ${lastTwoMonths}
   RETURNING *
  `,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

module.exports = {
  getWind,
  addWindEntry,
  getWindFromSource,
  deleteOldEntries,
  getWindForSail,
  getGustForSail,
  getLastUpdatedDate,
};
