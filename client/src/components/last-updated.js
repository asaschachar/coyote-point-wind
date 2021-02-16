import React, { useState, useEffect } from "react";
import moment from 'moment';

function App() {
  let [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchLastUpdated();
  }, []);

  function fetchLastUpdated() {
    fetch("/api/last_updated")
      .then(response => {
        return response.json();
      })
      .then(json => {
        setLastUpdated(json.last_updated);
      });
  }

  const lastUpdatedDate = lastUpdated
    ? moment(lastUpdated).format('MMM Do YYYY, h:mm:ss a')
    : '--'

  return (
    <div style={styles.lastUpdated}>Last Updated: { lastUpdatedDate }</div>
  );
}

const styles = {
  lastUpdated: {
    fontWeight: 400,
    fontSize: '1rem',
    fontColor: '#212529',
  },
}

export default App;
