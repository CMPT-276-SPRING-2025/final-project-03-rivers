import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate} from "react-router-dom";;
import LoginPage from "./Pages/Components/LoginPage";;
import Music from "./Pages/Music";;
import LoadingPage from "./Pages/LoadingPage";;
import MainP from "./Pages/MainP";
import SignupPage from "./Pages/Components/SignupPage";
import TaskForm from "./Pages/Components/TaskForm";
import TaskList from "./Pages/Components/TaskList";
import { fetchTasks } from "./Pages/Components/Todo";
import TaskManager from "./Pages/Components/TaskManager";
import { render, fireEvent, screen } from '@testing-library/react';
import Start from "./Pages/Start";

// Redirect to Task List if tasks exist, otherwise show Task Form
const TaskRedirect = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);

        if (fetchedTasks.length > 0) {
          navigate("/toDoL-show");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    checkTasks();
  }, [navigate]);

  // Wait for data to load before making a decision
  if (loading) {
    return <p>Loading...</p>;
  }

  return <TaskForm />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to SignupPage */}
        <Route path="/" element={<Navigate to="/start" />} />
        <Route path="/start" element={<Start />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/home" element={<MainP />} />
        <Route path="/home" element={<Music />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
