import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import HotelIcon from '@mui/icons-material/Hotel';
import MoodIcon from '@mui/icons-material/Mood';
import HeightIcon from '@mui/icons-material/Height';
import ScaleIcon from '@mui/icons-material/Scale';
import CakeIcon from '@mui/icons-material/Cake';
import SendIcon from '@mui/icons-material/Send';
import API_URL from '../config';

const api = axios.create({
  baseURL: API_URL,
});

const ComplementForm = () => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    motivation: '',
    sleepHours: '',
    stressLevel: '',
    badHabits: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // Redirection si non authentifié
  if (!userId) {
    navigate('/register');
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put(
        `/users/complete-profile/${userId}`,
        {
          age: parseInt(formData.age),
          weight: parseInt(formData.weight),
          height: parseInt(formData.height),
          sportDemotivation: formData.motivation,
          sleepHours: formData.sleepHours,
          stressLevel: formData.stressLevel,
          badHabits: formData.badHabits
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 1500); // Redirection après 1,5 seconde
      }
    } catch (err) {
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
        p: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 10% 90%, transparent 0%, transparent 70%, #A3D5FF 100%)',
          opacity: 0.4,
          zIndex: 0,
        }
      }}
    >
      {/* Animated fitness icons in the background */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          animation: 'pulse 6s infinite ease-in-out',
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.2)' },
          },
          opacity: 0.15,
          color: '#0A3D5C',
        }}
      >
        <FitnessCenterIcon sx={{ fontSize: 80 }} />
      </Box>
      
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          animation: 'moveUpDown 7s infinite ease-in-out',
          '@keyframes moveUpDown': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-30px)' },
          },
          opacity: 0.15,
          color: '#0A3D5C',
        }}
      >
        <DirectionsRunIcon sx={{ fontSize: 70 }} />
      </Box>
      
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: '10%',
          animation: 'rotate 10s infinite linear',
          '@keyframes rotate': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
          opacity: 0.15,
          color: '#0A3D5C',
        }}
      >
        <MonitorHeartIcon sx={{ fontSize: 60 }} />
      </Box>

      <Paper
        elevation={10}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: '650px',
          borderRadius: 3,
          backgroundColor: '#FFFFFF',
          position: 'relative',
          zIndex: 1,
          border: '1px solid rgba(10, 61, 92, 0.1)',
          boxShadow: '0 10px 25px rgba(10, 61, 92, 0.2)',
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
          <SportsGymnasticsIcon sx={{ 
            fontSize: 35, 
            color: '#0A3D5C', 
            mr: 1,
            animation: 'stretch 3s infinite ease-in-out',
            '@keyframes stretch': {
              '0%, 100%': { transform: 'scaleY(1)' },
              '50%': { transform: 'scaleY(1.2)' },
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
            Votre Profil Fitness
          </Typography>
        </Box>

        <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 3, color: '#5A6C7B' }}>
          Complétez ces informations pour obtenir un programme personnalisé
        </Typography>

        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              '& .MuiAlert-icon': { 
                color: '#2e7d32' 
              }
            }}
          >
            Profil mis à jour avec succès! Redirection...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              fullWidth
              margin="normal"
              label="Âge"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              required
              inputProps={{ min: 15, max: 100 }}
              InputProps={{
                startAdornment: <CakeIcon sx={{ mr: 1, color: '#0A3D5C' }} />,
              }}
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
              margin="normal"
              label="Poids (kg)"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              required
              inputProps={{ min: 30, max: 200 }}
              InputProps={{
                startAdornment: <ScaleIcon sx={{ mr: 1, color: '#0A3D5C' }} />,
              }}
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
              margin="normal"
              label="Taille (cm)"
              name="height"
              type="number"
              value={formData.height}
              onChange={handleChange}
              required
              inputProps={{ min: 100, max: 250 }}
              InputProps={{
                startAdornment: <HeightIcon sx={{ mr: 1, color: '#0A3D5C' }} />,
              }}
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
          </Box>

          <Box 
            sx={{ 
              mt: 2, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'rgba(10, 61, 92, 0.03)', 
              border: '1px solid rgba(10, 61, 92, 0.08)'
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#0A3D5C', fontWeight: 'bold' }}>
              <DirectionsRunIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'text-bottom' }} />
              Votre Routine Actuelle
            </Typography>

            <FormControl 
              fullWidth 
              margin="normal" 
              required
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
            >
              <InputLabel>Démotivation sportive</InputLabel>
              <Select
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                label="Motivation sportive"
              >
                <MenuItem value="Manque de temps">Manque de temps</MenuItem>
                <MenuItem value="Manque de résultats">Manque de résultats</MenuItem>
                <MenuItem value="Douleurs">Douleurs</MenuItem>
              </Select>
            </FormControl>

            <FormControl 
              fullWidth 
              margin="normal" 
              required
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
            >
              <InputLabel>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <HotelIcon sx={{ mr: 0.5, fontSize: 20 }} />
                  Heures de sommeil
                </Box>
              </InputLabel>
              <Select
                name="sleepHours"
                value={formData.sleepHours}
                onChange={handleChange}
                label="Heures de sommeil"
              >
                <MenuItem value="Moins de 6h">Moins de 6h</MenuItem>
                <MenuItem value="6h-8h">6h-8h</MenuItem>
                <MenuItem value="Plus de 8h">Plus de 8h</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <FormControl 
                fullWidth 
                margin="normal" 
                required
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
              >
                <InputLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MoodIcon sx={{ mr: 0.5, fontSize: 20 }} />
                    Niveau de stress
                  </Box>
                </InputLabel>
                <Select
                  name="stressLevel"
                  value={formData.stressLevel}
                  onChange={handleChange}
                  label="Niveau de stress"
                >
                  <MenuItem value="Faible">Faible</MenuItem>
                  <MenuItem value="Moyen">Moyen</MenuItem>
                  <MenuItem value="Élevé">Élevé</MenuItem>
                </Select>
              </FormControl>

              <FormControl 
                fullWidth 
                margin="normal" 
                required
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
              >
                <InputLabel>Mauvaises habitudes</InputLabel>
                <Select
                  name="badHabits"
                  value={formData.badHabits}
                  onChange={handleChange}
                  label="Mauvaises habitudes"
                >
                  <MenuItem value="Oui">Oui</MenuItem>
                  <MenuItem value="Non">Non</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            endIcon={<SendIcon />}
            sx={{
              mt: 4,
              mb: 1,
              backgroundColor: '#0A3D5C',
              borderRadius: '25px',
              padding: '12px 0',
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
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Finaliser mon profil'}
          </Button>
          
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: '#5A6C7B' }}>
            Ces informations nous permettent de vous proposer un programme adapté à vos besoins
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ComplementForm;