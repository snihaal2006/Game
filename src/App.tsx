import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectZeroDay from './components/ProjectZeroDay';
import Scoreboard from './components/scoreboard';
import AdminDashboard from './components/admin-dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectZeroDay />} />
        <Route path="/scoreboard" element={<Scoreboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
