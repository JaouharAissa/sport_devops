import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Divider,
  Chip,
  IconButton,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme
} from '@mui/material';
import { 
  Restaurant, 
  FreeBreakfast, 
  LunchDining, 
  DinnerDining, 
  LocalFireDepartment,
  Favorite,
  FavoriteBorder,
  ViewList,
  Close
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import API_URL from '../config';

const api = axios.create({
  baseURL: API_URL,
});

// Thème personnalisé avec des couleurs vibrantes
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#5A6C7B', // Bleu-gris sophistiqué (idéal avec un fond bleu doux)
      light: '#8198A6',
      dark: '#3B4D5C',
    },
    secondary: {
      main: '#F1A66B', // Orange doux, contrasté avec le bleu, mais subtil
      light: '#FFB07F', // Teinte encore plus claire d'orange pour apporter de la légèreté
      dark: '#C18051', // Teinte plus chaude de l'orange
    },
    breakfast: {
      main: '#F1A66B', // Orange doux et chaleureux, reste cohérent avec le thème global
      contrastText: '#fff',
    },
    lunch: {
      main: '#C1B7A4', // Beige chic et discret
      contrastText: '#fff',
    },
    dinner: {
      main: '#A28D7D', // Brun clair, qui se marie bien avec le bleu clair
      contrastText: '#fff',
    },
    text: {
      primary: '#3B4D5C', // Texte principal dans une couleur sombre et élégante
      secondary: '#5A6C7B', // Texte secondaire, une nuance plus douce
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#5A6C7B', // Texte harmonieux avec le bleu-gris
    },
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontStyle: 'italic',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

const NutritionPage = () => {
  const navigate = useNavigate();
  const [nutritions, setNutritions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [programme, setProgramme] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Récupérer le token depuis le localStorage
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
  }

  // Charger les nutritions correspondant au programme de l'utilisateur
  const fetchNutritions = async () => {
    setLoading(true);
    try {
      // Récupérer l'userId du localStorage
      const userId = localStorage.getItem('userId');
      
      const response = await axios.post(
      const response = await api.post(
        '/users/user/nutrition',
        { userId },
        {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setNutritions(response.data.nutritions);
        setProgramme(response.data.programme);
        
        // Récupérer les favoris depuis le localStorage ou l'initialiser
        const savedFavorites = localStorage.getItem('favoriteNutritions');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } else {
        setError(response.data.message || 'Erreur lors du chargement des nutritions');
        setSnackbar({
          open: true,
          message: response.data.message || 'Erreur lors du chargement des nutritions',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les nutritions');
      setSnackbar({
        open: true,
        message: 'Impossible de charger les nutritions',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les nutritions au chargement initial
  useEffect(() => {
    fetchNutritions();
  }, []);

  // Sauvegarder les favoris dans le localStorage quand ils changent
  useEffect(() => {
    localStorage.setItem('favoriteNutritions', JSON.stringify(favorites));
  }, [favorites]);

  // Filtrer les nutritions selon le repas sélectionné et les favoris
  const getFilteredNutritions = () => {
    let filtered = nutritions;
    
    if (currentTab !== 'all') {
      filtered = filtered.filter(nutrition => nutrition.repas === currentTab);
    }
    
    if (showFavorites) {
      filtered = filtered.filter(nutrition => favorites.includes(nutrition._id));
    }
    
    return filtered;
  };

  const filteredNutritions = getFilteredNutritions();

  // Fonction pour changer l'onglet actif
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Fonction pour traduire le type de repas
  const getRepasLabel = (repas) => {
    switch (repas) {
      case 'petitdejeuner': return 'Petit déjeuner';
      case 'dejeuner': return 'Déjeuner';
      case 'diner': return 'Dîner';
      default: return repas;
    }
  };

  // Fonction pour obtenir l'icône du repas
  const getRepasIcon = (repas) => {
    switch (repas) {
      case 'petitdejeuner': return <FreeBreakfast />;
      case 'dejeuner': return <LunchDining />;
      case 'diner': return <DinnerDining />;
      default: return <Restaurant />;
    }
  };

  // Fonction pour obtenir la couleur du repas
  const getRepasColor = (repas) => {
    switch (repas) {
      case 'petitdejeuner': return 'breakfast';
      case 'dejeuner': return 'lunch';
      case 'diner': return 'dinner';
      default: return 'primary';
    }
  };

  // Fonction pour ajouter/retirer des favoris
  const toggleFavorite = (nutritionId) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(nutritionId)) {
        setSnackbar({
          open: true,
          message: 'Retiré des favoris',
          severity: 'info'
        });
        return prevFavorites.filter(id => id !== nutritionId);
      } else {
        setSnackbar({
          open: true,
          message: 'Ajouté aux favoris',
          severity: 'success'
        });
        return [...prevFavorites, nutritionId];
      }
    });
  };

  // Fonction pour basculer l'affichage des favoris
  const toggleFavoritesView = () => {
    setShowFavorites(!showFavorites);
  };

  // Fermer la snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Container maxWidth="lg" sx={{ 
  mt: 4, 
  mb: 4,
  background: 'radial-gradient(circle at top left, #A7C7E7 0%, #D0E8F3 70%, #E3F2FD 100%)',
  minHeight: '100vh',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 -5px 25px rgba(255, 255, 255, 0.4)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at bottom right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)',
    pointerEvents: 'none'
  }
}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Votre Programme Nutritionnel
            </Typography>
        
          </Box>
          
          <Tooltip title={showFavorites ? "Afficher tous les plats" : "Afficher mes favoris"}>
            <IconButton 
              onClick={toggleFavoritesView}
              color={showFavorites ? "secondary" : "default"}
              sx={{ 
                backgroundColor: showFavorites ? 'rgba(255, 111, 0, 0.1)' : 'transparent',
                '&:hover': { backgroundColor: showFavorites ? 'rgba(255, 111, 0, 0.2)' : 'rgba(0, 0, 0, 0.04)' }
              }}
            >
              <Badge badgeContent={favorites.length} color="secondary">
                {showFavorites ? <ViewList fontSize="large" /> : <Favorite fontSize="large" />}
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
        
        <Paper 
          elevation={3} 
          sx={{ 
            mb: 4, 
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
            background: 'linear-gradient(90deg, rgba(46,125,50,0.1) 0%, rgba(255,255,255,1) 50%, rgba(255,111,0,0.1) 100%)'
          }}
        >
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            sx={{ 
              '& .MuiTab-root': { py: 2 },
              '& .MuiTabs-indicator': { height: 3 }
            }}
          >
            <Tab value="all" label="Tous les repas" icon={<Restaurant />} />
            <Tab value="petitdejeuner" label="Petit déjeuner" icon={<FreeBreakfast />} />
            <Tab value="dejeuner" label="Déjeuner" icon={<LunchDining />} />
            <Tab value="diner" label="Dîner" icon={<DinnerDining />} />
          </Tabs>
        </Paper>

        {showFavorites && (
          <Paper 
            elevation={2} 
            sx={{ 
              mb: 3, 
              p: 2, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              backgroundColor: 'rgba(255,111,0,0.1)',
              borderRadius: 3
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Favorite color="secondary" sx={{ mr: 1 }} />
              <Typography variant="h6" color="secondary">
                Mes Plats Favoris
              </Typography>
            </Box>
            <IconButton size="small" onClick={toggleFavoritesView}>
              <Close />
            </IconButton>
          </Paper>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress color="primary" size={60} thickness={4} />
          </Box>
        ) : filteredNutritions.length === 0 ? (
          <Paper 
            elevation={2} 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              borderRadius: 4,
              backgroundColor: 'rgba(46,125,50,0.05)',
              border: '1px dashed rgba(46,125,50,0.3)',
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              {showFavorites 
                ? "Vous n'avez pas encore de plats favoris pour cette catégorie." 
                : "Aucun élément nutritionnel disponible pour ce type de repas."}
            </Typography>
            {showFavorites && (
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={toggleFavoritesView}
                sx={{ mt: 2 }}
              >
                Voir tous les plats
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredNutritions.map(nutrition => (
              <Grid item xs={12} sm={6} md={4} key={nutrition._id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'visible',
                    boxShadow: '0 14px 10px rgba(0, 0, 0, 0.1)', // Effet de shadow flou
                    transition: 'box-shadow 0.3s ease-in-out', // Pour un effet de transition au survol
                    '&:hover': {
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'},
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={nutrition.image_path ? `${API_URL}/uploads/${nutrition.image_path}` : '/placeholder-food.jpg'}
                    alt={nutrition.nom_plat}
                    sx={{ 
                      borderTopLeftRadius: 16, 
                      borderTopRightRadius: 16,
                      filter: 'brightness(0.9)',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      }
                    }}
                  />

                <IconButton
                  onClick={() => toggleFavorite(nutrition._id)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.15)',
                    },
                    '&:focus': {
                      outline: 'none',
                      animation: 'pulse 0.5s ease infinite',
                    }
                  }}
                >
                      {favorites.includes(nutrition._id) ? (
                        <Favorite color="secondary" />
                      ) : (
                        <FavoriteBorder />
                      )}
                    </IconButton>
                    <Chip 
                      icon={getRepasIcon(nutrition.repas)} 
                      label={getRepasLabel(nutrition.repas)}
                      color={getRepasColor(nutrition.repas)}
                      sx={{ 
                        position: 'absolute', 
                        bottom: -12, 
                        left: 16, 
                        height: 32,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                        {nutrition.nom_plat}
                      </Typography>
                      <Chip 
                        icon={<LocalFireDepartment />} 
                        label={`${nutrition.calories} cal`}
                        color="secondary"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        fontSize: '0.9rem',
                        lineHeight: 1.6
                      }}
                    >
                      {nutrition.description}
                    </Typography>
                    
                    {nutrition.ingredients && nutrition.ingredients.length > 0 && (
                      <>
                        <Divider sx={{ my: 1.5 }} />
                        <Typography variant="subtitle2" sx={{ mt: 1, color: 'primary.main', fontWeight: 600 }}>
                          Ingrédients:
                        </Typography>
                        <Box 
                          component="ul" 
                          sx={{ 
                            pl: 2, 
                            mt: 0.5,
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 0.5,
                            listStyle: 'none',
                            padding: 0
                          }}
                        >
                          {nutrition.ingredients.map((ingredient, index) => (
                            <Chip
                              key={index}
                              label={ingredient}
                              size="small"
                              sx={{ 
                                backgroundColor: 'rgba(46, 125, 50, 0.08)', 
                                fontSize: '0.75rem',
                                height: 24,
                                '&:hover': {
                                  backgroundColor: 'rgba(46, 125, 50, 0.15)'
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </>
                    )}
                  </CardContent>
                  
                  <CardActions 
                    sx={{ 
                      borderTop: '1px solid rgba(0,0,0,0.08)',
                      padding: 1.5,
                      justifyContent: 'space-between'
                    }}
                  >
               
                    <Button
                      size="small"
                      color="secondary"
                      startIcon={favorites.includes(nutrition._id) ? <FavoriteBorder /> : <Favorite />}
                      onClick={() => toggleFavorite(nutrition._id)}
                      sx={{ borderRadius: 20 }}
                    >
                      {favorites.includes(nutrition._id) ? 'Retirer' : 'Favoris'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={4000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            variant="filled"
            sx={{ width: '100%', borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default NutritionPage;