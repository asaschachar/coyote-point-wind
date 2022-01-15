# Wind for Coyote Point Marina
Application to track wind overtime for Coyote Point Marina by saving data periodically from this [source](https://parks.smcgov.org/weather-coyote-point-marina)

[Live demo](http://coyote-point.asametrical.com/)

## Running Locally
- `yarn`
- `cd client && yarn`
- `cd ..`
- `yarn dev`

Made by following [this guide](https://www.freecodecamp.org/news/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0/)
And [this guide](https://blog.logrocket.com/nodejs-expressjs-postgresql-crud-rest-api-example/)

## Create the table
- Create a local table in `psql`:
`create table coyote_weather(
  wind varchar(3),
  wind_direction smallint,
  wind_gust varchar(3),
  wind_gust_date bigint,
  temp varchar(3),
  temp_feels_like varchar(3),
  barometer varchar(5),
  rain varchar(6),
  last_received bigint,
  humidity varchar(3)
);`

- Copy the remote table
`\copy (SELECT * FROM weather) TO '~/code/coyote-point-wind/data.csv' with csv`

- Import the remote table
\copy weather from '~/code/coyote-point-wind/data.csv' with (FORMAT csv);

## Feature Requests:

### P0 Features
- Find a way to prevent the chron jobs from being auto paused after 60 days of repository inactivity...

### P1 Features
- Fix spacing for mobile
- Add coffee button

### P2 Features
- Rainfall
- Temperature Now
- Feels Like Now

### P3 Features
- Weather Icon
- Wind Direction Over time
- Tide Chart

### P4 Features
- Real-time updates

