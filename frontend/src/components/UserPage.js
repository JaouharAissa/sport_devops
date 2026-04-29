import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { CheckCircle, Lock, Timer } from '@mui/icons-material';
import API_URL from '../config';

const api = axios.create({
  baseURL: API_URL,
});

const UserPage = () => {
  const navigate = useNavigate();
  const [currentDay, setCurrentDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [exercices, setExercices] = useState([]);
  const [progression, setProgression] = useState({
    joursTermines: [],
    dernierJour: 1,
    jourActuel: 1,
    exercicesTermines: []
  });
  const [openExercice, setOpenExercice] = useState(false);
  const [selectedExercice, setSelectedExercice] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [error, setError] = useState('');
  // Nouveaux états pour gérer le message de félicitation
  const [openCongrats, setOpenCongrats] = useState(false);
  const [congrats, setCongrats] = useState('');

  // Récupérer le token depuis le localStorage
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
  }

  // Charger les exercices du jour sélectionné
  const fetchExercices = async (jour) => {
    setLoading(true);
    try {
      // Récupérer l'userId du localStorage
      const userId = localStorage.getItem('userId');
      
      // Envoyer la requête POST avec userId et jour dans le corps
      const response = await api.post(
        '/users/user/programme',
        { userId, jour },
        {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setExercices(response.data.exercices);
        setProgression(response.data.progression);
        
        // Ne pas mettre à jour currentDay ici, sinon ça peut interférer avec le changement de tab
        // setCurrentDay(response.data.progression.jourActuel || jour);
      } else {
        setError(response.data.message || 'Erreur lors du chargement des exercices');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les exercices');
    } finally {
      setLoading(false);
    }
  };

  // Charger les exercices au chargement initial
  useEffect(() => {
    // Au premier chargement, récupérer le jour actuel de l'utilisateur
    const initializeDay = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const response = await api.post(
          '/users/user/programme',
          { userId, jour: 1 }, // On commence par récupérer les infos du jour 1
          {
            headers: { 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (response.data.success) {
          // Initialiser avec le jour actuel de l'utilisateur
          setCurrentDay(response.data.progression.jourActuel || 1);
          // Ensuite charger les exercices du jour actuel
          fetchExercices(response.data.progression.jourActuel || 1);
        }
      } catch (error) {
        console.error('Erreur d\'initialisation:', error);
      }
    };
    
    initializeDay();
  }, []);

  // Charger les exercices quand le jour change
  useEffect(() => {
    if (currentDay) {
      fetchExercices(currentDay);
    }
  }, [currentDay]);

  // Gestion du timer pour les exercices
  useEffect(() => {
    let interval = null;
    
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      // Marquer l'exercice comme terminé automatiquement
      if (selectedExercice) {
        handleCompleteExercice(selectedExercice._id);
      }
    }
    
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // Ouvrir la fenêtre d'exercice
  const handleOpenExercice = (exercice) => {
    setSelectedExercice(exercice);
    setTimeLeft(exercice.timer || 20);
    setTimerActive(false);
    setOpenExercice(true);
  };

  // Fermer la fenêtre d'exercice
  const handleCloseExercice = () => {
    setOpenExercice(false);
    setTimerActive(false);
  };

  // Fermer la fenêtre de félicitations
  const handleCloseCongrats = () => {
    setOpenCongrats(false);
  };

  // Démarrer le timer
  const handleStartTimer = () => {
    setTimerActive(true);
  };

  // Fonction pour changer le jour actif
  const handleDayChange = (e, newValue) => {
    // Vérifier si le jour est débloqué avant de changer
    if (newValue <= progression.dernierJour) {
      setCurrentDay(newValue);
    }
  };

  // Marquer un exercice comme terminé
  const handleCompleteExercice = async (exerciceId) => {
    try {
      const userId = localStorage.getItem('userId');
      
      const response = await api.post(
        '/users/user/exercice/terminer',
        { userId, exerciceId },
        {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // Vérifier si le programme a été terminé
        if (response.data.programmeTermine) {
          setCongrats('Félicitations ! Vous avez terminé le programme de 7 jours. Vous pouvez maintenant recommencer depuis le premier jour.');
          setOpenCongrats(true);
          
          // Mettre à jour la progression avec la réinitialisation
          setProgression(response.data.progression);
          
          // Mettre à jour le jour actuel à 1 (jour de début)
          setCurrentDay(1);
        } else {
          // Mettre à jour la progression locale normalement
          setProgression(response.data.progression);
          
          // Rafraîchir les exercices du jour actuel
          fetchExercices(currentDay);
        }
        
        // Fermer la fenêtre si ouverte
        if (openExercice) {
          handleCloseExercice();
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de marquer l\'exercice comme terminé');
    }
  };

  // Formater le temps pour l'affichage
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Vérifier si un exercice est terminé
  const isExerciceCompleted = (exerciceId) => {
    return progression.exercicesTermines.includes(exerciceId);
  };

  // Vérifier si un jour est terminé
  const isDayCompleted = (jour) => {
    return progression.joursTermines.includes(jour);
  };

  // Vérifier si un jour est débloqué
  const isDayUnlocked = (jour) => {
    return jour <= progression.dernierJour;
  };

  // Fonction debug pour afficher le statut actuel
  const debugStatus = () => {
    console.log("Jour actuel UI:", currentDay);
    console.log("Progression:", progression);
  };

return (
  <Box
    sx={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '20px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      m: 2, // marge autour du container
      maxWidth: '1200px',
      mx: 'auto', // Largeur fixe en pixels
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 60% 30%, #A7C7E7 0%, #D0E8F3 80%)',
        zIndex: -1,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-20%',
          width: '140%',
          height: '200%',
          background: 'radial-gradient(circle at top left, #A7C7E7 0%, #D0E8F3 70%, #E3F2FD 100%)',
          transform: 'rotate(-15deg)',
        },
      }}
    />

    <Container maxWidth="lg" sx={{ pt: 4, pb: 4, minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#5A6C7B', fontWeight: 'bold' }}>
        Votre Programme d'Entraînement
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Paper 
        elevation={3} 
        sx={{ 
          mb: 3, 
          p: 2, 
          backgroundColor: '#F5F7FA',
          borderRadius: '12px',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 20px rgba(90, 108, 123, 0.15)'
          }
        }}
      >
        <Tabs
          value={currentDay}
          onChange={handleDayChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#5A6C7B', // Couleur de l'indicateur de sélection
            },
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7].map(jour => (
            <Tab
              key={jour}
              label={`Jour ${jour}${jour === 3 ? ' (Repos)' : ''}`}
              value={jour}
              icon={
                isDayCompleted(jour) 
                  ? <CheckCircle color="success" /> 
                  : (!isDayUnlocked(jour) ? <Lock /> : null)
              }
              disabled={!isDayUnlocked(jour)}
            />
          ))}
        </Tabs>
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : currentDay === 3 ? (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            textAlign: 'center', 
            borderRadius: '12px',
            background: 'linear-gradient(to bottom, #F5F7FA, #FFFFFF)',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Jour de Repos
          </Typography>
          <Typography variant="body1">
            Aujourd'hui, c'est votre jour de repos ! Prenez le temps de récupérer et de vous hydrater.
            La récupération est essentielle pour que vos muscles se réparent et se renforcent.
          </Typography>
        </Paper>
      ) : exercices.length === 0 ? (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            textAlign: 'center',
            borderRadius: '12px',
            background: 'linear-gradient(to bottom, #F5F7FA, #FFFFFF)',
          }}
        >
          <Typography variant="body1">
            Aucun exercice disponible pour ce jour.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {exercices.map(exercice => (
            <Grid item xs={12} sm={6} md={4} key={exercice._id}>
              <Card 
                elevation={3}
                sx={{ 
                  position: 'relative', 
                  opacity: isExerciceCompleted(exercice._id) ? 0.8 : 1,
                  borderRadius: '12px',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                {isExerciceCompleted(exercice._id) && (
                  <Box sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    bgcolor: 'success.main',
                    color: 'white',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1
                  }}>
                    <CheckCircle />
                  </Box>
                )}
                
                <CardMedia
                  component="img"
                  height="200"
                  image={exercice.gif_path ? `${API_URL}/uploads/${exercice.gif_path}` : '/placeholder-exercise.jpg'}
                  alt={exercice.nom}
                  sx={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
                />
                
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {exercice.nom}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {exercice.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Timer sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">
                      {exercice.timer || 20} secondes
                    </Typography>
                  </Box>
                </CardContent>
                
                <CardActions>
                  <Button 
                    size="small" 
                    variant="contained"
                    onClick={() => handleOpenExercice(exercice)}
                    disabled={isExerciceCompleted(exercice._id)}
                    sx={{
                      borderRadius: '20px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {isExerciceCompleted(exercice._id) ? 'Terminé' : 'Commencer'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Dialogue pour afficher un exercice en cours */}
      <Dialog 
        open={openExercice} 
        onClose={handleCloseExercice}
        fullWidth
        maxWidth="md"
        PaperProps={{
          elevation: 8,
          sx: { borderRadius: '16px' }
        }}
      >
        {selectedExercice && (
          <>
            <DialogTitle>
              {selectedExercice.nom}
              <Typography variant="subtitle1" color="text.secondary">
                {formatTime(timeLeft)} secondes restantes
              </Typography>
            </DialogTitle>
            
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={(timeLeft / (selectedExercice.timer || 20)) * 100} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={selectedExercice.gif_path ? `${API_URL}/uploads/${selectedExercice.gif_path}` : '/placeholder-exercise.jpg'}
                    alt={selectedExercice.nom}
                    sx={{ 
                      objectFit: 'contain',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedExercice.description}
                  </Typography>
                  
                  <Typography variant="h6" gutterBottom>
                    Conseil
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedExercice.conseilId?.texte || 'Aucun conseil disponible'}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions>
              <Button 
                onClick={handleCloseExercice} 
                color="inherit"
                sx={{ borderRadius: '20px' }}
              >
                Fermer
              </Button>
              {!timerActive ? (
                <Button 
                  onClick={handleStartTimer} 
                  variant="contained" 
                  color="primary"
                  disabled={timerActive}
                  sx={{ 
                    borderRadius: '20px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)' 
                  }}
                >
                  Démarrer
                </Button>
              ) : (
                <Button 
                  onClick={() => handleCompleteExercice(selectedExercice._id)} 
                  variant="contained" 
                  color="success"
                  sx={{ 
                    borderRadius: '20px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)' 
                  }}
                >
                  Terminer maintenant
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Dialogue de félicitations pour la fin du programme */}
      <Dialog
        open={openCongrats}
        onClose={handleCloseCongrats}
        PaperProps={{
          elevation: 8,
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle>Félicitations!</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{congrats}</Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseCongrats} 
            variant="contained" 
            color="primary"
            sx={{ 
              borderRadius: '20px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)' 
            }}
          >
            Commencer un nouveau cycle
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar pour les messages temporaires */}
      <Snackbar 
        open={!!congrats && !openCongrats} 
        autoHideDuration={6000} 
        onClose={() => setCongrats('')}
      >
        <Alert 
          onClose={() => setCongrats('')} 
          severity="success" 
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)'
          }}
        >
          {congrats}
        </Alert>
      </Snackbar>
    </Container>
  </Box>
);
};
export default UserPage;