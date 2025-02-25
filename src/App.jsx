import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import FinanceTracker from "./pages/FinanceTracker";
import LandingPage from "./pages/LandingPage";
import Profile from "./pages/Profile";
import TaskManager from "./pages/TaskManager";

function App() {
  return (
    <div className="app-container">
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/committee-allocation" element={<TaskManager />} />
        <Route path="/finance-tracker" element={<FinanceTracker />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
