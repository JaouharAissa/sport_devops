import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField, Button, Box, Typography,
  CircularProgress, Paper, Link
} from "@mui/material";
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (formData.email === "admin@gmail.com" && formData.password === "admin") {
        localStorage.setItem("token", "admin-token");
        localStorage.setItem("userId", "admin-id");
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("userName", "Administrateur");
        navigate("/AdminDashboard");
        return;
      }

      const response = await fetch("http://localhost:3001/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Échec de la connexion");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("userEmail", formData.email);
      
      if (data.user.nom) {
        localStorage.setItem("userName", data.user.nom);
      } else if (data.user.prenom) {
        localStorage.setItem("userName", data.user.prenom);
      } else {
        localStorage.setItem("userName", formData.email.split('@')[0]);
      }

      navigate("/UserPage");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#E6F2FF', // Fond bleu très clair
        backgroundImage: 'linear-gradient(to bottom right, #E6F2FF, #C7E2FF)',
        backgroundSize: 'cover',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 10% 20%, transparent 0%, transparent 80%, #A3D5FF 100%)',
          opacity: 0.4,
          zIndex: 0,
        }
      }}
    >
      {/* Animated sports icons in the background */}
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          left: '10%',
          animation: 'float 8s infinite ease-in-out',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          opacity: 0.2,
          fontSize: '3rem',
          color: '#0A3D5C',
        }}
      >
        <SportsSoccerIcon sx={{ fontSize: 60 }} />
      </Box>
      
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          animation: 'float 7s infinite ease-in-out 1s',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-15px)' },
          },
          opacity: 0.2,
          fontSize: '3rem',
          color: '#0A3D5C',
        }}
      >
        <DirectionsRunIcon sx={{ fontSize: 60 }} />
      </Box>
      
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          right: '15%',
          animation: 'float 9s infinite ease-in-out 0.5s',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-25px)' },
          },
          opacity: 0.2,
          fontSize: '3rem',
          color: '#0A3D5C',
        }}
      >
        <FitnessCenterIcon sx={{ fontSize: 60 }} />
      </Box>

      <Paper
        elevation={10}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 10px 25px rgba(10, 61, 92, 0.2)',
          backgroundColor: '#FFFFFF',
          position: 'relative',
          zIndex: 1,
          border: '1px solid rgba(10, 61, 92, 0.1)',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '5px',
            background: 'linear-gradient(to right, #0A3D5C, #2C7EB8)',
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <SportsSoccerIcon sx={{ 
            fontSize: 35, 
            color: '#0A3D5C', 
            mr: 1, 
            animation: 'spin 4s infinite linear',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }} />
          <Typography 
            variant="h5" 
            component="h1" 
            sx={{ 
              color: '#0A3D5C', 
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}
          >
            Connexion
          </Typography>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Adresse email"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            sx={{
              '& .MuiInputLabel-root': { color: '#5A6C7B' },
              '& .MuiOutlinedInput-root': { 
                borderRadius: '8px',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2C7EB8',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0A3D5C',
                  borderWidth: '2px',
                }
              }
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de passe"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            sx={{
              '& .MuiInputLabel-root': { color: '#5A6C7B' },
              '& .MuiOutlinedInput-root': { 
                borderRadius: '8px',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2C7EB8',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0A3D5C',
                  borderWidth: '2px',
                }
              }
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            startIcon={<DirectionsRunIcon />}
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: '#0A3D5C',
              borderRadius: '25px',
              padding: '10px 0',
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: '0 4px 10px rgba(10, 61, 92, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#2C7EB8',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(10, 61, 92, 0.4)',
              },
              '&:active': {
                transform: 'translateY(1px)',
                boxShadow: '0 2px 6px rgba(10, 61, 92, 0.4)',
              }
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : "Se connecter"}
          </Button>

          <Box sx={{ 
            textAlign: 'center',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              backgroundColor: 'rgba(10, 61, 92, 0.1)',
              zIndex: 0
            }
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                position: 'relative', 
                backgroundColor: 'white', 
                padding: '0 10px',
                display: 'inline-block',
                zIndex: 1
              }}
            >
              Pas de compte ?{' '}
              <Link 
                href="/register" 
                variant="body2" 
                sx={{ 
                  color: '#2C7EB8', 
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  position: 'relative',
                  '&:hover': {
                    color: '#0A3D5C',
                    '&::after': {
                      width: '100%'
                    }
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-2px',
                    left: 0,
                    width: '0%',
                    height: '2px',
                    backgroundColor: '#0A3D5C',
                    transition: 'width 0.3s ease'
                  }
                }}
              >
                Créer un compte
              </Link>
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center', mt: 3, opacity: 0.7 }}>
            <FitnessCenterIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
            <Typography variant="caption" sx={{ color: '#5A6C7B' }}>
              Rejoignez notre communauté sportive
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;