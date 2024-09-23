import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import GamePage from './components/GamePage';
import UserResultsComponent from './components/ResultDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GamePage />} /> {/* Default route */}
        <Route path="/game" element={<GamePage />} />
        <Route path="/game-history" element={<UserResultsComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
