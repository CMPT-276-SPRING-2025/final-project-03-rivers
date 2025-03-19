import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './Pages/Components/LoginPage'
import Music from './Pages/Music'
import LoadingPage from './Pages/LoadingPage'
import MainP from './Pages/MainP';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        {/*Changed Music to MainP */} 
        <Route path="/home" element={<MainP />} />
        <Route path="/home" element={<Music />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;