import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './Pages/Components/LoginPage'
import Music from './Pages/Music'
import LoadingPage from './Pages/LoadingPage'
import MainP from './Pages/MainP';
import SignupPage from './Pages/Components/SignupPage';
import TaskManager from './Pages/Components/TaskManager';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        {/*Changed Music to MainP */} 
        {/*<Route path="/home" element={<MainP />} />
        <Route path="/home" element={<Music />} />*/}
        <Route path="/home" element={<TaskManager />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;