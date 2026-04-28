import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  TextField, Button, Box, Typography, CircularProgress, Paper, Link
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import API_URL from '../config';

const api = axios.create({
  baseURL: API_URL,
});

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  // Validation functions
  const validateUsername = (username) => {
    if (!username) return "Le nom d'utilisateur est requis";
    if (!/^[a-zA-Z]+$/.test(username)) return "Le nom d'utilisateur doit contenir uniquement des lettres";
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "L'email est requis";
    if (!/^[a-zA-Z0-9._-]+@gmail\.com$/.test(email)) return "L'email doit être au format nom@gmail.com";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Le mot de passe est requis";
    if (password.length < 8) return "Le mot de passe doit contenir au moins 8 caractères";
    if (!/[a-zA-Z]/.test(password)) return "Le mot de passe doit contenir au moins une lettre";
    if (!/[0-9]/.test(password)) return "Le mot de passe doit contenir au moins un chiffre";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate field on change
    let errorMessage = "";
    switch (name) {
      case 'username':
        errorMessage = validateUsername(value);
        break;
      case 'email':
        errorMessage = validateEmail(value);
        break;
      case 'password':
        errorMessage = validatePassword(value);
        break;
      default:
        break;
    }
    
    setErrors({ ...errors, [name]: errorMessage });
  };

  const validateForm = () => {
    const usernameError = validateUsername(formData.username);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    setErrors({
      username: usernameError,
      email: emailError,
      password: passwordError
    });
    
    return !usernameError && !emailError && !passwordError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setSubmitError('');

    try {
      const response = await api.post('/users/register', formData);
      
      if (response.data.success) {
        // Stocker l'ID utilisateur pour le complément de profil
        localStorage.setItem('userId', response.data.user._id);
        navigate('/complement');
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Erreur lors de l\'inscription');
      console.error('Registration error:', err.response?.data || err.message);
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
          backgroundImage: 'radial-gradient(circle at 90% 80%, transparent 0%, transparent 80%, #A3D5FF 100%)',
          opacity: 0.4,
          zIndex: 0,
        }
      }}
    >
      {/* Animated fitness icons in the background */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          animation: 'weightLift 4s infinite ease-in-out',
          '@keyframes weightLift': {
            '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
            '50%': { transform: 'translateY(-20px) rotate(5deg)' },
          },
          opacity: 0.2,
          fontSize: '3rem',
          color: '#0A3D5C',
        }}
      >
        <FitnessCenterIcon sx={{ fontSize: 70 }} />
      </Box>
      
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          animation: 'run 8s infinite ease-in-out 1s',
          '@keyframes run': {
            '0%': { transform: 'translateX(0)' },
            '50%': { transform: 'translateX(30px)' },
            '100%': { transform: 'translateX(0)' },
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
          top: '60%',
          right: '15%',
          animation: 'exercise 7s infinite ease-in-out 0.5s',
          '@keyframes exercise': {
            '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
            '50%': { transform: 'translateY(-15px) rotate(-5deg)' },
          },
          opacity: 0.2,
          fontSize: '3rem',
          color: '#0A3D5C',
        }}
      >
        <SportsGymnasticsIcon sx={{ fontSize: 65 }} />
      </Box>

      <Paper
        elevation={10}
        sx={{
          p: 4,
          maxWidth: 450,
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
          <FitnessCenterIcon sx={{ 
            fontSize: 35, 
            color: '#0A3D5C', 
            mr: 1,
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { opacity: 0.7, transform: 'scale(1)' },
              '50%': { opacity: 1, transform: 'scale(1.1)' },
              '100%': { opacity: 0.7, transform: 'scale(1)' }
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
            Inscription
          </Typography>
        </Box>

        {submitError && (
          <Typography color="error" sx={{ mb: 2, p: 1, bgcolor: 'rgba(255,0,0,0.05)', borderRadius: 1 }}>
            {submitError}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Nom d'utilisateur"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.username}
            helperText={errors.username}
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
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.email}
            helperText={errors.email}
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
            fullWidth
            label="Mot de passe"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.password}
            helperText={errors.password}
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
            disabled={loading}
            startIcon={<HowToRegIcon />}
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
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : "S'inscrire"}
          </Button>

          <Box sx={{ 
            textAlign: 'center',
            position: 'relative',
            mt: 2,
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
              Déjà un compte ?{' '}
              <Link 
                component={RouterLink}
                to="/login" 
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
                Se connecter
              </Link>
            </Typography>
          </Box>
          
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            bgcolor: 'rgba(10, 61, 92, 0.05)', 
            borderRadius: 2,
            border: '1px dashed rgba(10, 61, 92, 0.2)',
          }}>
            <Typography variant="body2" sx={{ color: '#5A6C7B', textAlign: 'center' }}>
              <FitnessCenterIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'text-bottom' }} />
              Rejoignez notre communauté fitness et accédez à votre programme d'entraînement!
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;