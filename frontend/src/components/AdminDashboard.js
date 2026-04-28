import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormHelperText from '@mui/material/FormHelperText';
import { Dialog, Container, Button, ListItemText, Typography, CircularProgress, Checkbox, 
  DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Chip ,Paper} from '@mui/material';
import { Select, InputLabel, FormControl, Box, Tab, Tabs } from "@mui/material";
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import API_URL from '../config';

const api = axios.create({
  baseURL: API_URL,
});

const AdminDashboard = () => {
  const [exercices, setExercices] = useState([]);
  const [conseils, setConseils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState('');
  const [programmes, setProgrammes] = useState([]);
  const [openAddExercice, setOpenAddExercice] = useState(false);
  const [openEditExercice, setOpenEditExercice] = useState(false);
  const [openAddConseil, setOpenAddConseil] = useState(false);
  const [openEditConseil, setOpenEditConseil] = useState(false);
  
  // États pour la nutrition
  const [nutritions, setNutritions] = useState([]);
  const [openAddNutrition, setOpenAddNutrition] = useState(false);
  const [openEditNutrition, setOpenEditNutrition] = useState(false);
  const [selectedNutrition, setSelectedNutrition] = useState(null);
  const [newNutrition, setNewNutrition] = useState({
    nom_plat: '',
    calories: 0,
    repas: 'petitdejeuner',
    programmeId: '',
    description: '',
    ingredients: [],
    image_file: null
  });
  const [newIngredient, setNewIngredient] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const [selectedExercice, setSelectedExercice] = useState(null);
  const [selectedConseil, setSelectedConseil] = useState(null);

  const [newExercice, setNewExercice] = useState({
    nom: '',
    description: '',
    conseilId: '',
    programmeIds: [],
    gif_file: null, 
    jour: 1,
    timer: 20
  });

  const [newConseil, setNewConseil] = useState({
    texte: ''
  });

  // Gestion du changement d'onglet
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Fonction pour ajouter un ingrédient
  const handleAddIngredient = () => {
    if (newIngredient.trim() !== '') {
      setNewNutrition({
        ...newNutrition,
        ingredients: [...newNutrition.ingredients, newIngredient.trim()]
      });
      setNewIngredient('');
    }
  };

  // Fonction pour supprimer un ingrédient
  const handleDeleteIngredient = (indexToDelete) => {
    setNewNutrition({
      ...newNutrition,
      ingredients: newNutrition.ingredients.filter((_, index) => index !== indexToDelete)
    });
  };

  const handleEditClick = (exercice) => {
    setSelectedExercice(exercice);
    
    api.get(`/admin/exercices/${exercice._id}`)
      .then(response => {
        const exerciceWithProgrammes = response.data;
        setNewExercice({
          ...exerciceWithProgrammes,
          gif_file: null
        });
        setOpenEditExercice(true);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des détails de l'exercice :", error);
        setError("Erreur lors du chargement des détails de l'exercice.");
      });
  };
  
  // Récupérer les exercices
  const fetchExercices = () => {
    setLoading(true);
    api.get('/admin/exercices')
      .then(response => {
        setExercices(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des exercices :", error);
        setError('Erreur lors de la récupération des exercices.');
        setLoading(false);
      });
  };
  
  // Récupérer les programmes
  const fetchProgrammes = () => {
    setLoading(true);
    api.get('/admin/programmes')
      .then(response => {
        setProgrammes(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des programmes :", error);
        setError('Erreur lors de la récupération des programmes.');
        setLoading(false);
      });
  };

  // Récupérer les conseils
  const fetchConseils = () => {
    setLoading(true);
    api.get('/admin/conseils')
      .then(response => {
        setConseils(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des conseils :", error);
        setError('Erreur lors de la récupération des conseils.');
        setLoading(false);
      });
  };

  // Récupérer les éléments nutrition
  const fetchNutritions = () => {
    setLoading(true);
    api.get('/admin/nutrition')
      .then(response => {
        setNutritions(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des éléments nutrition :", error);
        setError('Erreur lors de la récupération des éléments nutrition.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProgrammes();
    fetchExercices();
    fetchConseils();
    fetchNutritions();
  }, []);

  // Ajouter un exercice
  const handleAddExercice = () => {
    setLoadingAction(true);
    const formData = new FormData();
    formData.append('nom', newExercice.nom);
    formData.append('description', newExercice.description);
    formData.append('conseilId', newExercice.conseilId);
    formData.append('jour', newExercice.jour);
    formData.append('timer', newExercice.timer);
    if (newExercice.programmeIds && Array.isArray(newExercice.programmeIds)) {
      newExercice.programmeIds.forEach(id => {
        formData.append('programmeIds', id);
      });
    }
    
    if (newExercice.gif_file) {
      formData.append('gif_file', newExercice.gif_file);
    }
    
    console.log("Envoi du formulaire avec les données :", {
      nom: newExercice.nom,
      description: newExercice.description,
      conseilId: newExercice.conseilId,
      programmeIds: newExercice.programmeIds
    });
    
    api.post('/admin/exercices/add', formData)
      .then((response) => {
        console.log("Exercice ajouté avec succès:", response.data);
        fetchExercices();
        setOpenAddExercice(false);
        setNewExercice({
          nom: '',
          description: '',
          conseilId: '',
          programmeIds: [],
          gif_file: null,
          jour: 1,
          timer: 20
        });
        setLoadingAction(false);
      })
      .catch(error => {
        console.error("Erreur lors de l'ajout de l'exercice :", error.response?.data || error.message);
        setError('Erreur lors de l\'ajout de l\'exercice.');
        setLoadingAction(false);
      });
  };

  const handleEditExercice = () => {
    setLoadingAction(true);
  
    const uploadGifAndEdit = async () => {
      try {
        let gifPath = newExercice.gif_path || '';
  
        if (newExercice.gif_file) {
          const formData = new FormData();
          formData.append('gif', newExercice.gif_file);
  
          const response = await api.post('/admin/upload-gif', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
  
          gifPath = response.data.gifPath || response.data.filePath || gifPath;
        }
  
        const updatedExercice = {
          nom: newExercice.nom,
          description: newExercice.description,
          conseilId: newExercice.conseilId,
          programmes: newExercice.programmes,
          gifPath: gifPath,
          jour: newExercice.jour,
          timer: newExercice.timer
        };
  
        await api.put(
          `/admin/exercices/${selectedExercice._id}`,
          updatedExercice
        );
  
        fetchExercices();
        setOpenEditExercice(false);
      } catch (error) {
        console.error("Erreur lors de la modification de l'exercice :", error);
        setError("Erreur lors de la modification de l'exercice.");
      } finally {
        setLoadingAction(false);
      }
    };
  
    uploadGifAndEdit();
  };

  // Supprimer un exercice
  const handleDeleteExercice = (id) => {
    setLoadingAction(true);
    api.delete(`/admin/exercices/${id}`)
      .then(() => {
        fetchExercices();
        setLoadingAction(false);
      })
      .catch(error => {
        console.error("Erreur lors de la suppression de l'exercice :", error);
        setError('Erreur lors de la suppression de l\'exercice.');
        setLoadingAction(false);
      });
  };

  // Ajouter un conseil
  const handleAddConseil = () => {
    setLoadingAction(true);
    api.post('/admin/conseils/add', newConseil)
      .then(() => {
        fetchConseils();
        setOpenAddConseil(false);
        setLoadingAction(false);
      })
      .catch(error => {
        console.error("Erreur lors de l'ajout du conseil :", error);
        setError('Erreur lors de l\'ajout du conseil.');
        setLoadingAction(false);
      });
  };

  // Modifier un conseil
  const handleEditConseil = () => {
    setLoadingAction(true);
    api.put(`/admin/conseils/${selectedConseil._id}`, newConseil)
      .then(() => {
        fetchConseils();
        setOpenEditConseil(false);
        setLoadingAction(false);
      })
      .catch(error => {
        console.error("Erreur lors de la modification du conseil :", error);
        setError('Erreur lors de la modification du conseil.');
        setLoadingAction(false);
      });
  };

  // Supprimer un conseil
  const handleDeleteConseil = (id) => {
    setLoadingAction(true);
    api.delete(`/admin/conseils/${id}`)
      .then(() => {
        fetchConseils();
        setLoadingAction(false);
      })
      .catch(error => {
        console.error("Erreur lors de la suppression du conseil :", error);
        setError('Erreur lors de la suppression du conseil.');
        setLoadingAction(false);
      });
  };

  // Ajouter un élément nutrition
  const handleAddNutrition = () => {
    setLoadingAction(true);
    const formData = new FormData();
    formData.append('nom_plat', newNutrition.nom_plat);
    formData.append('calories', newNutrition.calories);
    formData.append('repas', newNutrition.repas);
    formData.append('programmeId', newNutrition.programmeId);
    formData.append('description', newNutrition.description);
    formData.append('ingredients', JSON.stringify(newNutrition.ingredients));
    
    if (newNutrition.image_file) {
      formData.append('image_file', newNutrition.image_file);
    }
    
    api.post('/admin/nutrition/add', formData)
      .then((response) => {
        console.log("Élément nutrition ajouté avec succès:", response.data);
        fetchNutritions();
        setOpenAddNutrition(false);
        setNewNutrition({
          nom_plat: '',
          calories: 0,
          repas: 'petitdejeuner',
          programmeId: '',
          description: '',
          ingredients: [],
          image_file: null
        });
        setLoadingAction(false);
      })
      .catch(error => {
        console.error("Erreur lors de l'ajout de l'élément nutrition :", error.response?.data || error.message);
        setError('Erreur lors de l\'ajout de l\'élément nutrition.');
        setLoadingAction(false);
      });
  };

  // Modifier un élément nutrition
  const handleEditNutrition = () => {
    setLoadingAction(true);
    const formData = new FormData();
    formData.append('nom_plat', newNutrition.nom_plat);
    formData.append('calories', newNutrition.calories);
    formData.append('repas', newNutrition.repas);
    formData.append('programmeId', newNutrition.programmeId);
    formData.append('description', newNutrition.description);
    formData.append('ingredients', JSON.stringify(newNutrition.ingredients));
    
    if (newNutrition.image_file) {
      formData.append('image_file', newNutrition.image_file);
    }
    
    api.put(`/admin/nutrition/${selectedNutrition._id}`, formData)
      .then(() => {
        fetchNutritions();
        setOpenEditNutrition(false);
        setLoadingAction(false);
      })
      .catch(error => {
        console.error("Erreur lors de la modification de l'élément nutrition :", error);
        setError('Erreur lors de la modification de l\'élément nutrition.');
        setLoadingAction(false);
      });
  };

  // Supprimer un élément nutrition
  const handleDeleteNutrition = (id) => {
    setLoadingAction(true);
    api.delete(`/admin/nutrition/${id}`)
      .then(() => {
        fetchNutritions();
        setLoadingAction(false);
      })
      .catch(error => {
        console.error("Erreur lors de la suppression de l'élément nutrition :", error);
        setError('Erreur lors de la suppression de l\'élément nutrition.');
        setLoadingAction(false);
      });
  };

  // Préparation pour l'édition d'un élément nutrition
  const handleEditNutritionClick = (nutrition) => {
    setSelectedNutrition(nutrition);
    setNewNutrition({
      ...nutrition,
      image_file: null // Pas besoin d'envoyer le fichier à nouveau s'il n'est pas modifié
    });
    setOpenEditNutrition(true);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#E6F2FF',
        backgroundImage: 'linear-gradient(to bottom right, #E6F2FF, #C7E2FF)',
        backgroundSize: 'cover',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 4,
        paddingBottom: 4,
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
  
      <Container sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: '0 10px 25px rgba(10, 61, 92, 0.2)',
            backgroundColor: '#FFFFFF',
            position: 'relative',
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
            alignItems: 'center', 
            mb: 3 
          }}>
            <FitnessCenterIcon sx={{ 
              fontSize: 35, 
              color: '#0A3D5C', 
              mr: 1,
              animation: 'pulse 2s infinite ease-in-out',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
              }
            }} />
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                color: '#0A3D5C', 
                fontWeight: 'bold',
                letterSpacing: '0.5px'
              }}
            >
              Tableau de bord Admin
            </Typography>
          </Box>
  
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              aria-label="admin tabs"
              sx={{
                '& .MuiTab-root': {
                  color: '#5A6C7B',
                  fontWeight: 'medium',
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&.Mui-selected': {
                    color: '#0A3D5C',
                    fontWeight: 'bold',
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#2C7EB8',
                  height: 3,
                }
              }}
            >
              <Tab label="Exercices" />
              <Tab label="Conseils" />
              <Tab label="Nutrition" />
            </Tabs>
          </Box>
  
          {/* Onglet Exercices */}
          {activeTab === 0 && (
            <Box>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setOpenAddExercice(true)} 
                sx={{ 
                  mb: 2,
                  backgroundColor: '#0A3D5C',
                  borderRadius: '25px',
                  padding: '8px 20px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  boxShadow: '0 4px 10px rgba(10, 61, 92, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#2C7EB8',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 12px rgba(10, 61, 92, 0.4)',
                  }
                }}
              >
                Ajouter un Exercice
              </Button>
              
              {loading ? (
                <CircularProgress sx={{ color: '#0A3D5C' }} />
              ) : (
                <div>
                  <Typography variant="h6" gutterBottom sx={{ color: '#0A3D5C', fontWeight: 'bold' }}>Liste des Exercices</Typography>
                  {exercices.map((exercice) => (
                    <Paper
                      key={exercice._id}
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        borderRadius: 2,
                        boxShadow: '0 4px 8px rgba(10, 61, 92, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 6px 12px rgba(10, 61, 92, 0.15)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#0A3D5C' }}>{exercice.nom}</Typography>
                      <Typography variant="body2" gutterBottom sx={{ color: '#5A6C7B' }}>{exercice.description}</Typography>
                      <Box sx={{ mt: 1 }}>
                        <Button 
                          color="primary" 
                          onClick={() => handleEditClick(exercice)}
                          sx={{ 
                            color: '#2C7EB8',
                            '&:hover': { color: '#0A3D5C' }
                          }}
                        >
                          Modifier
                        </Button>
                        <Button 
                          color="error" 
                          onClick={() => handleDeleteExercice(exercice._id)}
                          sx={{ 
                            '&:hover': { background: 'rgba(211, 47, 47, 0.04)' }
                          }}
                        >
                          Supprimer
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </div>
              )}
            </Box>
          )}
  
          {/* Onglet Conseils */}
          {activeTab === 1 && (
            <Box>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setOpenAddConseil(true)} 
                sx={{ 
                  mb: 2,
                  backgroundColor: '#0A3D5C',
                  borderRadius: '25px',
                  padding: '8px 20px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  boxShadow: '0 4px 10px rgba(10, 61, 92, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#2C7EB8',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 12px rgba(10, 61, 92, 0.4)',
                  }
                }}
              >
                Ajouter un Conseil
              </Button>
              
              {loading ? (
                <CircularProgress sx={{ color: '#0A3D5C' }} />
              ) : (
                <div>
                  <Typography variant="h6" gutterBottom sx={{ color: '#0A3D5C', fontWeight: 'bold' }}>Liste des Conseils</Typography>
                  {conseils.map((conseil) => (
                    <Paper
                      key={conseil._id}
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        borderRadius: 2,
                        boxShadow: '0 4px 8px rgba(10, 61, 92, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 6px 12px rgba(10, 61, 92, 0.15)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <Typography variant="body1" sx={{ color: '#5A6C7B' }}>{conseil.texte}</Typography>
                      <Box sx={{ mt: 1 }}>
                        <Button 
                          color="primary" 
                          onClick={() => {
                            setSelectedConseil(conseil);
                            setNewConseil(conseil);
                            setOpenEditConseil(true);
                          }}
                          sx={{ 
                            color: '#2C7EB8',
                            '&:hover': { color: '#0A3D5C' }
                          }}
                        >
                          Modifier
                        </Button>
                        <Button 
                          color="error" 
                          onClick={() => handleDeleteConseil(conseil._id)}
                          sx={{ 
                            '&:hover': { background: 'rgba(211, 47, 47, 0.04)' }
                          }}
                        >
                          Supprimer
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </div>
              )}
            </Box>
          )}
  
          {/* Onglet Nutrition */}
          {activeTab === 2 && (
            <Box>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setOpenAddNutrition(true)} 
                sx={{ 
                  mb: 2,
                  backgroundColor: '#0A3D5C',
                  borderRadius: '25px',
                  padding: '8px 20px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  boxShadow: '0 4px 10px rgba(10, 61, 92, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#2C7EB8',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 12px rgba(10, 61, 92, 0.4)',
                  }
                }}
              >
                Ajouter un Plat
              </Button>
              
              {loading ? (
                <CircularProgress sx={{ color: '#0A3D5C' }} />
              ) : (
                <div>
                  <Typography variant="h6" gutterBottom sx={{ color: '#0A3D5C', fontWeight: 'bold' }}>Liste des Plats</Typography>
                  {nutritions.map((nutrition) => (
                    <Paper
                      key={nutrition._id}
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        borderRadius: 2,
                        boxShadow: '0 4px 8px rgba(10, 61, 92, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 6px 12px rgba(10, 61, 92, 0.15)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        {nutrition.image_path && (
                          <Box sx={{ flexShrink: 0, mr: 2 }}>
                            <img 
                              src={`${API_URL}/uploads/${nutrition.image_path}`} 
                              alt={nutrition.nom_plat}
                              style={{ 
                                width: '100px', 
                                height: '100px', 
                                objectFit: 'cover', 
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(10, 61, 92, 0.15)'
                              }}
                            />
                          </Box>
                        )}
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#0A3D5C' }}>{nutrition.nom_plat}</Typography>
                          <Typography variant="body2" sx={{ color: '#5A6C7B' }}>
                            {nutrition.calories} calories | {nutrition.repas === 'petitdejeuner' ? 'Petit déjeuner' : nutrition.repas === 'dejeuner' ? 'Déjeuner' : 'Dîner'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#5A6C7B' }}>{nutrition.description}</Typography>
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" fontWeight="bold" sx={{ color: '#0A3D5C' }}>Ingrédients:</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {nutrition.ingredients.map((ingredient, index) => (
                                <Chip 
                                  key={index} 
                                  label={ingredient} 
                                  size="small"
                                  sx={{
                                    backgroundColor: 'rgba(44, 126, 184, 0.1)',
                                    color: '#2C7EB8',
                                    fontWeight: 'medium',
                                    '&:hover': {
                                      backgroundColor: 'rgba(44, 126, 184, 0.2)',
                                    }
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Button 
                          color="primary" 
                          onClick={() => handleEditNutritionClick(nutrition)}
                          sx={{ 
                            color: '#2C7EB8',
                            '&:hover': { color: '#0A3D5C' }
                          }}
                        >
                          Modifier
                        </Button>
                        <Button 
                          color="error" 
                          onClick={() => handleDeleteNutrition(nutrition._id)}
                          sx={{ 
                            '&:hover': { background: 'rgba(211, 47, 47, 0.04)' }
                          }}
                        >
                          Supprimer
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </div>
              )}
            </Box>
          )}
  
          {/* Ajouter Exercice Dialog */}
          <Dialog open={openAddExercice} onClose={() => setOpenAddExercice(false)}>
            <DialogTitle sx={{ color: '#0A3D5C', fontWeight: 'bold' }}>Ajouter un Exercice</DialogTitle>
            <DialogContent>
              <TextField label="Nom" fullWidth margin="dense" value={newExercice.nom} onChange={(e) => setNewExercice({ ...newExercice, nom: e.target.value })} />
              <TextField label="Description" fullWidth margin="dense" value={newExercice.description} onChange={(e) => setNewExercice({ ...newExercice, description: e.target.value })} />
              <InputLabel id="conseil-select-label">Conseil</InputLabel>
              <Select
                labelId="conseil-select-label"
                value={newExercice.conseilId}
                label="Conseil"
                onChange={(e) =>
                  setNewExercice({ ...newExercice, conseilId: e.target.value })
                }
              >
                {conseils.map((conseil) => (
                  <MenuItem key={conseil._id} value={conseil._id}>
                    {conseil.texte}
                  </MenuItem>
                ))}
              </Select>
              <InputLabel id="programme-select-label">Programmes</InputLabel>
              <Select
                labelId="programme-select-label"
                multiple
                value={newExercice.programmeIds || []}
                onChange={(e) => setNewExercice({ ...newExercice, programmeIds: e.target.value })}
                renderValue={(selected) => selected.map(id => {
                  const prog = programmes.find(p => p._id === id);
                  return prog ? prog.nom : '';
                }).join(', ')}
                fullWidth
              >
                {programmes.map((programme) => (
                  <MenuItem key={programme._id} value={programme._id}>
                    <Checkbox checked={(newExercice.programmeIds || []).includes(programme._id)} />
                    <ListItemText primary={programme.nom} />
                  </MenuItem>
                ))}
              </Select>
              <InputLabel id="jour-select-label">Jour</InputLabel>
              <Select
                labelId="jour-select-label"
                value={newExercice.jour || ''}
                onChange={(e) => setNewExercice({ ...newExercice, jour: e.target.value })}
                fullWidth
                margin="dense"
              >
                {[1, 2, 4, 5, 6, 7].map((jour) => (
                  <MenuItem key={jour} value={jour}>
                    Jour {jour}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Choisissez un jour (le jour 3 est réservé à la pause)</FormHelperText>

              <TextField 
                label="Timer (secondes)" 
                type="number" 
                fullWidth 
                margin="dense" 
                value={newExercice.timer} 
                onChange={(e) => setNewExercice({ 
                  ...newExercice, 
                  timer: Math.max(1, parseInt(e.target.value) || 20)
                })}
                inputProps={{ min: 1 }}
                helperText="Durée de l'exercice en secondes"
              />
              <input
                type="file"
                accept="image/gif"
                onChange={(e) => setNewExercice({ ...newExercice, gif_file: e.target.files[0] })}
                style={{ marginTop: '10px' }}
              />
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setOpenAddExercice(false)} 
                sx={{ color: '#5A6C7B' }}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleAddExercice} 
                sx={{ 
                  backgroundColor: '#0A3D5C', 
                  color: 'white',
                  '&:hover': { backgroundColor: '#2C7EB8' }
                }}
              >
                Ajouter
              </Button>
            </DialogActions>
          </Dialog>
  
          {/* Les autres dialogs avec le même style que ci-dessus */}
          {/* Modifier Exercice Dialog */}
          <Dialog open={openEditExercice} onClose={() => setOpenEditExercice(false)}>
            <DialogTitle sx={{ color: '#0A3D5C', fontWeight: 'bold' }}>Modifier un Exercice</DialogTitle>
            <DialogContent>
            <TextField label="Nom" fullWidth margin="dense" value={newExercice.nom} onChange={(e) => setNewExercice({ ...newExercice, nom: e.target.value })} />
            <TextField label="Description" fullWidth margin="dense" value={newExercice.description} onChange={(e) => setNewExercice({ ...newExercice, description: e.target.value })} />
            <TextField select label="Conseil" fullWidth margin="dense" value={newExercice.conseilId} onChange={(e) => setNewExercice({ ...newExercice, conseilId: e.target.value })}>
              {conseils.map((conseil) => (
                <MenuItem key={conseil._id} value={conseil._id}>{conseil.texte}</MenuItem>
              ))}
            </TextField>
            <InputLabel id="jour-select-label">Jour</InputLabel>
            <Select
              labelId="jour-select-label"
              value={newExercice.jour || ''}
              onChange={(e) => setNewExercice({ ...newExercice, jour: e.target.value })}
              fullWidth
              margin="dense"
            >
              {[1, 2, 4, 5, 6, 7].map((jour) => (
                <MenuItem key={jour} value={jour}>
                  Jour {jour}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Choisissez un jour (le jour 3 est réservé à la pause)</FormHelperText>


            <TextField 
              label="Timer (secondes)" 
              type="number" 
              fullWidth 
              margin="dense" 
              value={newExercice.timer} 
              onChange={(e) => setNewExercice({ 
                ...newExercice, 
                timer: Math.max(1, parseInt(e.target.value) || 20)
              })}
              inputProps={{ min: 1 }}
              helperText="Durée de l'exercice en secondes"
            />

            <input
              type="file"
              accept="image/gif"
              onChange={(e) => setNewExercice({ ...newExercice, gif_file: e.target.files[0] })}
              style={{ marginTop: '10px' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditExercice(false)} color="secondary">Annuler</Button>
            <Button onClick={handleEditExercice} color="primary">Modifier</Button>
          </DialogActions>
        </Dialog>
  
          {/* Ajouter Conseil Dialog */}
          <Dialog open={openAddConseil} onClose={() => setOpenAddConseil(false)}>
            <DialogTitle sx={{ color: '#0A3D5C', fontWeight: 'bold' }}>Ajouter un Conseil</DialogTitle>
            <DialogContent>
            <TextField
              label="Conseil"
              fullWidth
              margin="dense"
              value={newConseil.texte}
              onChange={(e) => setNewConseil({ ...newConseil, texte: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddConseil(false)} color="secondary">Annuler</Button>
            <Button onClick={handleAddConseil} color="primary">Ajouter</Button>
          </DialogActions>
        </Dialog>
  
          {/* Modifier Conseil Dialog */}
          <Dialog open={openEditConseil} onClose={() => setOpenEditConseil(false)}>
            <DialogTitle sx={{ color: '#0A3D5C', fontWeight: 'bold' }}>Modifier un Conseil</DialogTitle>
            <DialogContent>
            <TextField
              label="Conseil"
              fullWidth
              margin="dense"
              value={newConseil.texte}
              onChange={(e) => setNewConseil({ ...newConseil, texte: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditConseil(false)} color="secondary">Annuler</Button>
            <Button onClick={handleEditConseil} color="primary">Modifier</Button>
          </DialogActions>
        </Dialog>
  
          {/* Ajouter Nutrition Dialog */}
          <Dialog open={openAddNutrition} onClose={() => setOpenAddNutrition(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ color: '#0A3D5C', fontWeight: 'bold' }}>Ajouter un Plat</DialogTitle>
            <DialogContent>
            <TextField 
              label="Nom du plat" 
              fullWidth 
              margin="dense" 
              value={newNutrition.nom_plat}
              onChange={(e) => setNewNutrition({ ...newNutrition, nom_plat: e.target.value })}
            />
            
            <TextField 
              label="Calories" 
              type="number" 
              fullWidth 
              margin="dense" 
              value={newNutrition.calories} 
              onChange={(e) => setNewNutrition({ ...newNutrition, calories: parseInt(e.target.value) || 0 })} 
              inputProps={{ min: 0 }}
            />
            
            <FormControl fullWidth margin="dense">
              <InputLabel id="repas-select-label">Repas</InputLabel>
              <Select
                labelId="repas-select-label"
                value={newNutrition.repas}
                label="Repas"
                onChange={(e) => setNewNutrition({ ...newNutrition, repas: e.target.value })}
              >
                <MenuItem value="petitdejeuner">Petit déjeuner</MenuItem>
                <MenuItem value="dejeuner">Déjeuner</MenuItem>
                <MenuItem value="diner">Dîner</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="dense">
              <InputLabel id="programme-nutrition-select-label">Programme</InputLabel>
              <Select
                labelId="programme-nutrition-select-label"
                value={newNutrition.programmeId}
                label="Programme"
                onChange={(e) => setNewNutrition({ ...newNutrition, programmeId: e.target.value })}
              >
                {programmes.map((programme) => (
                  <MenuItem key={programme._id} value={programme._id}>{programme.nom}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField 
              label="Description" 
              fullWidth 
              margin="dense" 
              multiline
              rows={3}
              value={newNutrition.description}
              onChange={(e) => setNewNutrition({ ...newNutrition, description: e.target.value })}
            />
            
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="subtitle1">Ingrédients</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {newNutrition.ingredients.map((ingredient, index) => (
                  <Chip 
                    key={index} 
                    label={ingredient} 
                    onDelete={() => handleDeleteIngredient(index)} 
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', mt: 1 }}>
                <TextField
                  label="Nouvel ingrédient"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  fullWidth
                />
                <Button 
                  onClick={handleAddIngredient}
                  variant="contained" 
                  sx={{ ml: 1 }}
                >
                  Ajouter
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Image du plat</Typography>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewNutrition({ ...newNutrition, image_file: e.target.files[0] })}
                style={{ marginTop: '10px' }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddNutrition(false)} color="secondary">Annuler</Button>
            <Button onClick={handleAddNutrition} color="primary">Ajouter</Button>
          </DialogActions>
        </Dialog>
  
          {/* Modifier Nutrition Dialog */}
          <Dialog open={openEditNutrition} onClose={() => setOpenEditNutrition(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ color: '#0A3D5C', fontWeight: 'bold' }}>Modifier un Plat</DialogTitle>
            <DialogContent>
            <TextField 
              label="Nom du plat" 
              fullWidth 
              margin="dense" 
              value={newNutrition.nom_plat}
              onChange={(e) => setNewNutrition({ ...newNutrition, nom_plat: e.target.value })}
            />
            
            <TextField 
              label="Calories" 
              type="number" 
              fullWidth 
              margin="dense" 
              value={newNutrition.calories} 
              onChange={(e) => setNewNutrition({ ...newNutrition, calories: parseInt(e.target.value) || 0 })} 
              inputProps={{ min: 0 }}
            />
            
            <FormControl fullWidth margin="dense">
              <InputLabel id="repas-edit-select-label">Repas</InputLabel>
              <Select
                labelId="repas-edit-select-label"
                value={newNutrition.repas}
                label="Repas"
                onChange={(e) => setNewNutrition({ ...newNutrition, repas: e.target.value })}
              >
                <MenuItem value="petitdejeuner">Petit déjeuner</MenuItem>
                <MenuItem value="dejeuner">Déjeuner</MenuItem>
                <MenuItem value="diner">Dîner</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="dense">
              <InputLabel id="programme-nutrition-edit-select-label">Programme</InputLabel>
              <Select
                labelId="programme-nutrition-edit-select-label"
                value={newNutrition.programmeId}
                label="Programme"
                onChange={(e) => setNewNutrition({ ...newNutrition, programmeId: e.target.value })}
              >
                {programmes.map((programme) => (
                  <MenuItem key={programme._id} value={programme._id}>{programme.nom}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField 
              label="Description" 
              fullWidth 
              margin="dense" 
              multiline
              rows={3}
              value={newNutrition.description}
              onChange={(e) => setNewNutrition({ ...newNutrition, description: e.target.value })}
            />
            
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="subtitle1">Ingrédients</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {newNutrition.ingredients.map((ingredient, index) => (
                  <Chip 
                    key={index} 
                    label={ingredient} 
                    onDelete={() => handleDeleteIngredient(index)} 
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', mt: 1 }}>
                <TextField
                  label="Nouvel ingrédient"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  fullWidth
                />
                <Button 
                  onClick={handleAddIngredient}
                  variant="contained" 
                  sx={{ ml: 1 }}
                >
                  Ajouter
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Image du plat</Typography>
              {newNutrition.image_path && (
                <Box sx={{ mb: 1 }}>
                  <img 
                    src={`${API_URL}/uploads/${newNutrition.image_path}`} 
                    alt="Current"
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <Typography variant="caption" display="block">Image actuelle</Typography>
                </Box>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewNutrition({ ...newNutrition, image_file: e.target.files[0] })}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditNutrition(false)} color="secondary">Annuler</Button>
            <Button onClick={handleEditNutrition} color="primary">Modifier</Button>
          </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </Box>
  );
};
export default AdminDashboard;