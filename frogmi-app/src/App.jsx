import React, { useState } from 'react';
import CommentsForm from './components/CommentsForm';
import FeaturesList from './components/FeaturesList';


function App() {
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);

  const handleFeatureSelect = (featureId) => {
    setSelectedFeatureId(featureId);
  };

  return (
    <div>
      <CommentsForm featureId={selectedFeatureId} />
      <h1>Info Sismos</h1>
      <FeaturesList onFeatureSelect={handleFeatureSelect} />
    </div>
  );
}

export default App;
