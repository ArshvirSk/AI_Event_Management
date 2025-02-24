import "./App.css";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import FinanceTracker from "./pages/FinanceTracker";
import Dashboard from "./pages/Dashboard";
import CommitteeAllocation from "./pages/CommitteeAllocation";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/finance-tracker" element={<FinanceTracker />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/committee-allocation" element={<CommitteeAllocation />} />
      </Routes>
    </div>
  );
}

export default App;
