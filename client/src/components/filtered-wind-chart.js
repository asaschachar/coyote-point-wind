import React, { Fragment, useContext, useState } from "react";
import { LineChart, Tooltip, Line, CartesianGrid, ReferenceLine, ReferenceDot, XAxis, YAxis } from 'recharts';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import moment from 'moment';
import Arrow from './arrow.js'
import getScreenSize from '../helpers/get-screen-size.js'
import WindowSizeContext from '../helpers/window-size-context.js'
import { DateTimePicker } from "@material-ui/pickers";
import { directionFormatter } from '../helpers/formatters.js'
import uniqBy from 'lodash/uniqBy';

let THIRTY_MIN = 1000*60*30;
let ONE_HOUR = 1000*60*60;
let TIME_STEP = ONE_HOUR*4;
let ONE_DAY = ONE_HOUR*24;

export default function WindChart({ data }) {

  const windowSize = useContext(WindowSizeContext)
  const { isDesktop, isTablet, isMobile } = getScreenSize(windowSize)
  const styles = getStyles({ isDesktop, isTablet, isMobile })
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);


  let dateTimePickers = (
    <div style={styles.timePickerContainer}>
      <div style={styles.timePickers}>
        <DateTimePicker
          style={styles.timePicker}
          label="Start Time"
          inputVariant="outlined"
          value={startDateTime}
          onChange={setStartDateTime}
        />
        <DateTimePicker
          style={styles.timePicker}
          label="End Time"
          inputVariant="outlined"
          value={endDateTime}
          onChange={setEndDateTime}
        />
      </div>
    </div>
  )

  if (!startDateTime || !endDateTime || startDateTime >= endDateTime) {
    return (dateTimePickers)
  }

  if (data === null) {
    return (
      <div style={styles.loadingArea}>
        <Spinner
          size="xl"
          animation="border"
        />
      </div>
    );
  }

  let startTimestamp = moment(startDateTime).unix()*1000;
  let endTimestamp = moment(endDateTime).unix()*1000;
  data = data && data
    .filter((item) => ( item.last_received > startTimestamp))
    .filter((item) => ( item.last_received < endTimestamp ));

  let minOver = (moment(startDateTime).minute() % 15)*60*1000;
  let ticks = (new Array(Math.round((endTimestamp - startTimestamp) / (THIRTY_MIN)) + 2)).fill(undefined).map((value, index) => {
    return startTimestamp - minOver + index*THIRTY_MIN;
  });

  let windBoundaries = [12, 24, 36].map((value, i) => (<ReferenceLine key={`${i}-wind`} stroke="#ccc" y={value} />));
  let gustDots = data && data.map((item, i) => (<ReferenceDot key={`${i}-gust`} x={item.wind_gust_date} r={4} stroke="#c00" y={item.wind_gust} />));

  let timeFormatter = (unixTime => moment(unixTime).format('h:mm a'))
  let speedFormatter = (speed => `${speed} knots`)
  let dirFormat = (direction => `${direction}° - ${directionFormatter(direction)}`)
  let windTable = (
    <Table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Speed</th>
          <th>Direction</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr key={`row-${i}`}>
            {(
              <>
                <td key={`${i}-time`}> { timeFormatter(item.last_received) } </td>
                <td key={`${i}-speed`}> { speedFormatter(item.wind) } </td>
                <td key={`${i}-direction`}> { dirFormat(item.wind_direction) } </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  )

  let gustData = data && data.filter((item) => ( item.wind_gust_date > startTimestamp && item.wind_gust_date < endTimestamp))
  gustData = uniqBy(gustData, 'wind_gust_date');

  let gustTable = (
    <Table>
      <thead>
        <tr>
          <th>Gust Time</th>
          <th>Gust Speed</th>
        </tr>
      </thead>
      <tbody>
        {gustData.map((item, i) => (
          <tr key={`row-${i}`}>
            {(
              <>
                <td key={`${i}-time`}> { timeFormatter(item.wind_gust_date) } </td>
                <td key={`${i}-speed`}> { speedFormatter(item.wind_gust) } </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  )

  const customArrowDot = (data) => (
    <Arrow
      key={`dot-${data.payload.last_received}`}
      direction={data.payload.wind_direction}
      wind={data.payload.wind}
      cx={data.cx}
      cy={data.cy}
    />
  )

  return (
    <div style={styles.chartContainer}>
      { dateTimePickers }
      <div style={styles.chart}>
        <LineChart width={styles.chart.width} height={400} data={data}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="wind" dot={customArrowDot}/>
          { gustDots }
          { windBoundaries }
          <XAxis
            xAxisId={0}
            domain = {[startDateTime, endDateTime]}
            tickLine={false}
            ticks={ticks}
            type="number"
            dataKey="last_received"
            tickFormatter = {(unixTime) => moment(unixTime).format('H:mm')}
          />
          <YAxis
            ticks={[4, 8, 12, 16, 20, 24, 28, 32]}
            domain={[0, 35]}
          />
          <Tooltip
            labelFormatter={timeFormatter}
          />
        </LineChart>
      </div>
      <div style={styles.table}>
        { windTable }
      </div>
      <div style={styles.table}>
        { gustTable }
      </div>
    </div>
  )
}

const getStyles = ({ isDesktop, isMobile, isTablet }) => {
  let tableMods, timePickerContainerMods, chartMods, timePickerMods;

  if (isMobile) {
    timePickerContainerMods = {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
    }
    chartMods = {
      marginLeft: '20px',
    }
    timePickerMods = {
      margin: '0px'
    }
  }

  return {
    chart: {
      width: 300,
      ...(isMobile && { width: 400 }),
      ...(isTablet && { width: 500 }),
      ...(isDesktop && { width: 800 }),
      ...chartMods,
    },
    timePickerContainer: {
      ...timePickerContainerMods,
    },
    table: {
      margin: '50px',
      maxWidth: '750px',
    },
    timePickers: {
      margin: '40px 0px 10px 30px',
      display: 'flex',
      flexDirection: 'row',
      ... timePickerMods,
    },
    timePicker: {
      margin: '20px 20px',
    },
    loadingArea: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '800px',
      height: '300px',
    },
    rawData: {
      margin: '20px 0px 0px 50px',
    },
    chartContainer: {
      ... (isMobile && {
        marginBottom: '30px',
      })
    }
  }
}
