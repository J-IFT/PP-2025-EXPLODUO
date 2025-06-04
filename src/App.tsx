import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SupabaseProvider } from './contexts/SupabaseContext';
import Home from './pages/Home';
import Game from './pages/Game';

function App() {
  return (
    <SupabaseProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:gameId" element={<Game />} />
          </Routes>
        </div>
      </Router>
    </SupabaseProvider>
  );
}

export default App;