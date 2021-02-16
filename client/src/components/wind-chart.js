import React, { useContext } from "react";
import { LineChart, Tooltip, Line, CartesianGrid, ReferenceLine, ReferenceDot, XAxis, YAxis } from 'recharts';
import Spinner from 'react-bootstrap/Spinner';
import moment from 'moment';
import Arrow from './arrow.js'
import getScreenSize from '../helpers/get-screen-size.js'
import WindowSizeContext from '../helpers/window-size-context.js'

let ONE_HOUR = 1000*60*60;
let TIME_STEP = ONE_HOUR*4;
let ONE_DAY = ONE_HOUR*24;

export default function WindChart({ data }) {

  const windowSize = useContext(WindowSizeContext)
  const { isDesktop, isTablet, isMobile } = getScreenSize(windowSize)
  const styles = getStyles ({ isDesktop, isTablet, isMobile })

  let startDay = moment().subtract(styles.chart.days, 'd').startOf('day').unix()*1000
  let endDay = moment().add(1, 'd').startOf('day').unix()*1000

  data = data && data.filter((item) => ( item.last_received > startDay ));

  let daysBetween = (new Array(Math.round((endDay - startDay) / (ONE_DAY)))).fill(undefined).map((value, index) => {
    return startDay + index*ONE_DAY;
  });

  let centeredDaysBetween = daysBetween.map((value) => (value + ONE_DAY / 2));

  let timesBetween = (new Array(Math.round((endDay - startDay) / (TIME_STEP)))).fill(undefined).map((value, index) => {
    return startDay + index*TIME_STEP;
  });

  let dayBoundaries = daysBetween.map((value, i) => (<ReferenceLine key={`${i}-day`} stroke="#ccc" x={value} />));
  let windBoundaries = [12, 24, 36].map((value, i) => (<ReferenceLine key={`${i}-wind`} stroke="#ccc" y={value} />));
  let gustDots = data && data.map((item, i) => (<ReferenceDot key={`${i}-gust`} x={item.wind_gust_date} r={4} stroke="#c00" y={item.wind_gust} />));

  const customArrowDot = (data) => {
    return (
      <Arrow
        key={`dot-${data && data.payload && data.payload.last_received}`}
        direction={data.payload.wind_direction}
        wind={data.payload.wind}
        cx={data.cx}
        cy={data.cy}
      />
    )
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

  return (
    <div style={styles.chartContainer}>
      <LineChart width={styles.chart.width} height={400} data={data}>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="wind" dot={customArrowDot}/>
        { gustDots }
        { dayBoundaries }
        { windBoundaries }
        <XAxis
          xAxisId={0}
          domain = {[startDay, endDay]}
          tickLine={false}
          ticks={timesBetween}
          type="number"
          dataKey="last_received"
          tickFormatter = {(unixTime) => moment(unixTime).format('H')}
        />
        <XAxis
          xAxisId={1}
          domain = {[startDay, endDay]}
          ticks={centeredDaysBetween}
          tickLine={false}
          axisLine={false}
          type="number"
          dataKey="last_received"
          tickFormatter = {(unixTime) => moment(unixTime).format('MMM Do')}
        />
        <YAxis
          ticks={[4, 8, 12, 16, 20, 24, 28, 32]}
          domain={[0, 35]}
        />
        <Tooltip
          labelFormatter= {(unixTime => moment(unixTime).format('h:mm a'))}
        />
      </LineChart>
    </div>
  )
}

const getStyles = ({ isDesktop, isTablet, isMobile }) => {
  return {
    chartContainer: {
      ...(isMobile && {
        marginTop: "85px",
        marginLeft: "-15px"
      }),
    },
    chart: {
      width: 300,
      ...(isMobile && { width: 400 }),
      ...(isTablet && { width: 500 }),
      ...(isDesktop && { width: 800 }),
      days: 1,
      ...(isMobile && { days: 1 }),
      ...(isTablet && { days: 2 }),
      ...(isDesktop && { days: 3 }),
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
  }
}
