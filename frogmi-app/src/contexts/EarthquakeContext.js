import React, { createContext, useState, useContext } from 'react';

const EarthquakeContext = createContext();

export const useEarthquakes = () => useContext(EarthquakeContext);

export const EarthquakeProvider = ({ children }) => {
  const [earthquakes, setEarthquakes] = useState([]);

  const value = {
    earthquakes,
    setEarthquakes,
  };

  return (
    <EarthquakeContext.Provider value={value}>
      {children}
    </EarthquakeContext.Provider>
  );
};
