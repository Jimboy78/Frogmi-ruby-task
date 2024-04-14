import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EarthquakeProvider } from './contexts/EarthquakeContext';
import EarthquakeList from './components/EarthquakeList';
import EarthquakeDetails from './components/EarthquakeDetails';

function App() {
  return (
    <Router>
      <EarthquakeProvider>
        <div>
          <Routes>
            <Route path="/" element={<EarthquakeList />} />
            <Route path="/earthquake/:earthquakeId" element={<EarthquakeDetails />} />
          </Routes>
        </div>
      </EarthquakeProvider>
    </Router>
  );
}

export default App;
