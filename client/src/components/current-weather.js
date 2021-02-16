import React, { useContext } from "react";
import Spinner from 'react-bootstrap/Spinner';
import moment from 'moment';
import getScreenSize from '../helpers/get-screen-size.js'
import BigArrow from './big-arrow.js'
import WindowSizeContext from '../helpers/window-size-context.js'
import { directionFormatter } from '../helpers/formatters.js'

export default function CurrentWeather({ data }) {

  const windowSize = useContext(WindowSizeContext)
  const { isDesktop, isTablet, isMobile } = getScreenSize(windowSize)
  const styles = getStyles({ isDesktop, isTablet, isMobile })

  if (data === null || data.length === 0) {
    return null;
  }

  let latestEntry = data[data.length - 1]
  let compassDirection = directionFormatter(latestEntry.wind_direction)

  return (
    <div style={styles.currentWeatherPanel}>
      <div style={styles.header}>
        <h1>{ latestEntry.wind }</h1>
        <div style={styles.subText}> knots</div>
      </div>
      <div style={styles.compassContainer}>
        <div style={styles.arrowContainer}>
          <BigArrow direction={latestEntry.wind_direction} />
        </div>
        <div style={styles.compassSubtext}>
          <div>{compassDirection}</div>
        </div>
      </div>
    </div>
  )
}


const getStyles = ({ isMobile, isTablet, isDesktop }) => {
  return {
    arrowContainer: {
      width: '50px',
      height: '50px',
      overflow: 'hidden',
    },
    header: {
      display: 'flex',
      margin: '10px',
    },
    compassContainer: {
      marginLeft: '20px',
      display: 'flex',
    },
    subText: {
      marginLeft: '5px',
      alignSelf: 'center',
    },
    compassSubtext: {
      display: 'flex',
      justifyContent: 'center',
      width: '50px',
      alignSelf: 'center',
    },
    loadingArea: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: '50px',
    },
    currentWeatherPanel: {
      ...(isMobile && {
          position: "absolute",
          width: '100%',
          justifyContent: 'center',
          left: "5px",
          display: "flex",
          alignItems: "center",
      })
    }
  }
}
