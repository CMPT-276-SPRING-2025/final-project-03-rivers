import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './Pages/Components/LoginPage'
import Login from './Pages/Login'
import LoadingPage from './Pages/LoadingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/home" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;