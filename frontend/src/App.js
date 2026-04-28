import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import AdminDashboard from "./components/AdminDashboard";
import UserPage from "./components/UserPage";
import ComplementForm from "./components/ComplementForm";
import NutritionPage from './components/NutritionPage';
import Layout from "./components/Layout"; // Nous allons créer ce composant

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques sans Navbar */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/complement" element={<ComplementForm />} />
        
        {/* Routes avec Navbar */}
        <Route element={<Layout />}>
          {/* Routes utilisateur standard */}
          <Route path="/UserPage" element={<UserPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          
          {/* Route admin */}
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
        </Route>
        
        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;