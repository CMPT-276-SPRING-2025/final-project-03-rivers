import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './Pages/Components/LoginPage'
import Music from './Pages/Music'
import LoadingPage from './Pages/LoadingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/home" element={<Music />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;