import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Pages/Components/LoginPage';
import Music from './Pages/Music';
import LoadingPage from './Pages/LoadingPage';
import MainP from './Pages/MainP';
import SignupPage from './Pages/Components/SignupPage';
import TaskManager from './Pages/Components/TaskManager';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to SignupPage */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/home" element={<MainP />} />
        <Route path="/home" element={<Music />} />
        <Route path="/toDoL" element={<TaskManager />} />

   
      </Routes>
    </BrowserRouter>
  );
}

export default App;
