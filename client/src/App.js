import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import useWindowSize from './helpers/window-size-hook.js'
import getScreenSize from './helpers/get-screen-size.js'
import WindChart from './components/wind-chart.js';
import FilteredWindChart from './components/filtered-wind-chart.js';
import LastUpdated from './components/last-updated.js';
import CurrentWeather from './components/current-weather.js';
import WindowSizeContext from './helpers/window-size-context.js';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

function App() {
  let [windData, setWindData] = useState(null);

  const windowSize = useWindowSize();
  const { isDesktop, isTablet, isMobile } = getScreenSize(windowSize)
  const styles = getStyles({ isDesktop, isTablet, isMobile })

  useEffect(() => {
    fetchWindData();
  }, []);

  function fetchWindData() {
    fetch("/api/wind")
      .then(response => {
        return response.json();
      })
      .then(json => {
        setWindData(json.map((item) => ({
          wind: Number(item.wind),
          wind_direction: Number(item.wind_direction),
          wind_gust: Number(item.wind_gust),
          wind_gust_date: Number(item.wind_gust_date),
          last_received: Number(item.last_received),
          temp: Number(item.temp),
          temp_feels_like: Number(item.temp_feels_like),
          humidity: Number(item.humidity),
        })));
      });
  }

  return (
    <WindowSizeContext.Provider value={windowSize}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <div className="home">
          <div style={styles.header}>
            <h1>Coyote Point Wind</h1>
            <LastUpdated />
          </div>
          <div style={styles.panel}>
            <WindChart data={windData} />
            <CurrentWeather data={windData} />
          </div>
          <div>
            <FilteredWindChart data={windData} />
          </div>
        </div>
      </MuiPickersUtilsProvider>
    </WindowSizeContext.Provider>
  );
}

const getStyles = ({ isDesktop, isTablet, isMobile }) => {
  let panelMods, headerMods;

  if (isMobile) {
    headerMods = {
      margin: '30px 8px 8px 8px',
      textAlign: 'center',
    };
    panelMods = {
      justifyContent: 'center',
      marginLeft: '-30px',
    };
  }

  return {
    panel: {
      display: 'flex',
      ...panelMods,
    },
    header: {
      fontSize: '2em',
      margin: '20px 20px 20px 50px',
      fontWeight: 'bold',
      ...headerMods,
    }
  }
}

export default App;
