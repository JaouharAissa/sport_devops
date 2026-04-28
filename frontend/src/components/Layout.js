import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // Nous utiliserons la Navbar créée précédemment

const Layout = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);
  
  if (!isAuthenticated) {
    return null; // Ne rien afficher pendant la vérification d'authentification
  }
  
  return (
    <>
      <Navbar />
      <Outlet /> {/* Affiche le contenu de la route enfant */}
    </>
  );
};

export default Layout;