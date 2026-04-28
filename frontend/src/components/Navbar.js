import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  Avatar
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DashboardIcon from "@mui/icons-material/Dashboard";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    const checkIfAdmin = () => {
      const email = localStorage.getItem("userEmail");
      if (email === "admin@gmail.com") {
        setIsAdmin(true);
      }
      
      // Récupérer le nom d'utilisateur si disponible
      const storedUserName = localStorage.getItem("userName");
      if (storedUserName) {
        setUserName(storedUserName);
      }
    };

    checkIfAdmin();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    // Supprimer les informations de l'utilisateur du localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    
    // Rediriger vers la page de connexion
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  // Contenu du drawer pour mobile
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        FitApp
      </Typography>
      <Divider />
      <List>
        {isAdmin ? (
          <ListItem button onClick={() => handleNavigation("/AdminDashboard")}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard Admin" />
          </ListItem>
        ) : (
          <>
            <ListItem button onClick={() => handleNavigation("/UserPage")}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Mon Programme" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation("/nutrition")}>
              <ListItemIcon>
                <RestaurantIcon />
              </ListItemIcon>
              <ListItemText primary="Nutrition" />
            </ListItem>
          </>
        )}
        <Divider />
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Déconnexion" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(135deg, #6A8FB3 0%, #A0C9E2 100%)',// Applique le fond dégradé ici
          boxShadow: 'none', // Supprime l'ombre si tu veux un design plus épuré
        }}
      >
        <Container maxWidth="xl">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography
              variant="h6"
              component={Link}
              to={isAdmin ? "/AdminDashboard" : "/UserPage"}
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
                flexGrow: { xs: 1, md: 0 }
              }}
            >
              FitApp
            </Typography>
            
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            >
              FitApp
            </Typography>
            
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {isAdmin ? (
                <Button
                  color="inherit"
                  onClick={() => handleNavigation("/AdminDashboard")}
                  startIcon={<DashboardIcon />}
                >
                  Dashboard Admin
                </Button>
              ) : (
                <>
                  <Button
                    color="inherit"
                    onClick={() => handleNavigation("/UserPage")}
                    startIcon={<PersonIcon />}
                  >
                    Mon Programme
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => handleNavigation("/nutrition")}
                    startIcon={<RestaurantIcon />}
                  >
                    Nutrition
                  </Button>
                </>
              )}
            </Box>
            
            {userName && (
              <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: "secondary.main" }}>
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="body2" sx={{ display: { xs: "none", md: "block" } }}>
                  {userName}
                </Typography>
              </Box>
            )}
            
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<ExitToAppIcon />}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              Déconnexion
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Pour une meilleure performance sur mobile
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Navbar;
