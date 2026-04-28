const express = require('express');
const multer = require('multer');
const path = require('path');
const Exercice = require('../../models/Exercice');
const Conseil = require('../../models/Conseil');
const Programme = require('../../models/Programme');
const ProgrammeExercice = require('../../models/ProgrammeExercice');
const Nutrition = require('../../models/Nutrition');
const router = express.Router();

// Configuration de Multer pour l'upload des fichiers GIF
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');  // Dossier où les GIFs seront stockés
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Nom du fichier unique
  }
});
const upload = multer({ storage: storage });

// Route pour uploader un GIF
router.post('/upload-gif', upload.single('gif'), (req, res) => {
  if (!req.file) {
    return res.status(400).send("Aucun fichier n'a été téléchargé.");
  }
  const gifPath = `/uploads/exercices/${req.file.filename}`;
  res.json({ gifPath });
});

// API pour créer un exercice
router.post('/exercices/add', upload.single('gif_file'), async (req, res) => {
  try {
    const { nom, description, conseilId, jour, timer } = req.body;
    // Récupérer les programmeIds sous forme de tableau
    const programmeIds = Array.isArray(req.body.programmeIds) 
      ? req.body.programmeIds 
      : req.body.programmeIds 
        ? [req.body.programmeIds] 
        : [];
    
    // Créer et sauvegarder le nouvel exercice
    const newExercice = new Exercice({
      nom,
      description,
      conseilId,
      gif_path: req.file ? req.file.filename : null,
      jour: parseInt(jour) || 1, // Jour par défaut à 1 si non spécifié
      timer: parseInt(timer) || 20 // Timer par défaut à 20 secondes
    });

    const savedExercice = await newExercice.save();
    
    // Créer les liens avec les programmes sélectionnés
    const programmeExercicePromises = programmeIds.map(programmeId => {
      const programmeExercice = new ProgrammeExercice({
        programmeId,
        exerciceId: savedExercice._id
      });
      return programmeExercice.save();
    });
    
    // Attendre que tous les liens soient créés
    if (programmeExercicePromises.length > 0) {
      await Promise.all(programmeExercicePromises);
    }
    
    res.status(201).json(savedExercice);
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'exercice :", error.message);
    res.status(500).send("Erreur lors de l'ajout de l'exercice.");
  }
});

// API pour éditer un exercice
router.put('/exercices/:id', async (req, res) => {
  try {
    const { nom, description, conseilId, programmeIds, jour, timer } = req.body;
    
    // Mettre à jour l'exercice
    const exercice = await Exercice.findByIdAndUpdate(
      req.params.id,
      { 
        nom, 
        description, 
        conseilId,
        jour: parseInt(jour) || undefined,
        timer: parseInt(timer) || undefined
      },
      { new: true }
    );
    
    if (!exercice) {
      return res.status(404).send("Exercice non trouvé");
    }
    
    // Mettre à jour les liens avec les programmes
    if (programmeIds) {
      // Supprimer les liens existants
      await ProgrammeExercice.deleteMany({ exerciceId: req.params.id });
      
      // Créer les nouveaux liens
      const programmeExercicePromises = programmeIds.map(programmeId => {
        const programmeExercice = new ProgrammeExercice({
          programmeId,
          exerciceId: req.params.id
        });
        return programmeExercice.save();
      });
      
      await Promise.all(programmeExercicePromises);
    }
    
    res.status(200).json(exercice);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la modification de l'exercice.");
  }
});

// API pour supprimer un exercice
router.delete('/exercices/:id', async (req, res) => {
  try {
    await Exercice.findByIdAndDelete(req.params.id);
    res.status(200).send("Exercice supprimé avec succès.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la suppression de l'exercice.");
  }
});
// API pour récupérer tous les exercices
router.get('/exercices', async (req, res) => {
  try {
    const exercices = await Exercice.find();
    res.json(exercices);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération des exercices.");
  }
});
// API pour récupérer tous les programmes
router.get('/programmes', async (req, res) => {
  try {
    const programmes = await Programme.find();
    res.json(programmes);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération des programmes.");
  }
});
//Route pour récupérer un exercice avec ses programmes
// Ajouter cette route pour faciliter l'édition
router.get('/exercices/:id', async (req, res) => {
  try {
    const exercice = await Exercice.findById(req.params.id);
    
    if (!exercice) {
      return res.status(404).send("Exercice non trouvé");
    }
    
    // Récupérer les programmes liés à cet exercice
    const programmeExercices = await ProgrammeExercice.find({ exerciceId: req.params.id });
    const programmeIds = programmeExercices.map(pe => pe.programmeId);
    
    // Combiner les informations
    const result = {
      ...exercice.toObject(),
      programmeIds
    };
    
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération de l'exercice.");
  }
});
// API pour récupérer tous les conseils
router.get('/conseils', async (req, res) => {
  try {
    const conseils = await Conseil.find();
    res.json(conseils);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération des conseils.");
  }
});

// API pour ajouter un conseil
router.post('/conseils/add', async (req, res) => {
  try {
    const { texte } = req.body;
    const newConseil = new Conseil({ texte });
    await newConseil.save();
    res.status(201).json(newConseil);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de l'ajout du conseil.");
  }
});

// API pour supprimer un conseil
router.delete('/conseils/:id', async (req, res) => {
  try {
    await Conseil.findByIdAndDelete(req.params.id);
    res.status(200).send("Conseil supprimé avec succès.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la suppression du conseil.");
  }
});

// API pour lier un exercice à un programme
router.post('/programmes/:programmeId/exercices/:exerciceId', async (req, res) => {
  try {
    const { programmeId, exerciceId } = req.params;
    const programmeExercice = new ProgrammeExercice({
      programmeId,
      exerciceId
    });
    await programmeExercice.save();
    res.status(201).json(programmeExercice);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de l'ajout de l'exercice au programme.");
  }
});
// Modifier un conseil
router.put('/conseils/:id', (req, res) => {
    const { texte } = req.body;
  
    Conseil.findByIdAndUpdate(req.params.id, { texte }, { new: true })
      .then(conseil => res.status(200).json(conseil))
      .catch(err => res.status(500).json({ error: 'Erreur lors de la modification du conseil' }));
  });

// API pour supprimer un exercice d'un programme
router.delete('/programmes/:programmeId/exercices/:exerciceId', async (req, res) => {
  try {
    await ProgrammeExercice.findOneAndDelete({
      programmeId: req.params.programmeId,
      exerciceId: req.params.exerciceId
    });
    res.status(200).send("Exercice supprimé du programme avec succès.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la suppression de l'exercice du programme.");
  }
});
// API pour récupérer tous les éléments nutrition
router.get('/nutrition', async (req, res) => {
  try {
    const nutritions = await Nutrition.find().populate('programmeId', 'nom');
    res.json(nutritions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération des éléments nutrition.");
  }
});

// API pour récupérer un élément nutrition par ID
router.get('/nutrition/:id', async (req, res) => {
  try {
    const nutrition = await Nutrition.findById(req.params.id).populate('programmeId', 'nom');
    if (!nutrition) {
      return res.status(404).send("Élément nutrition non trouvé");
    }
    res.json(nutrition);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération de l'élément nutrition.");
  }
});

// API pour ajouter un élément nutrition avec upload d'image
router.post('/nutrition/add', upload.single('image_file'), async (req, res) => {
  try {
    const { nom_plat, calories, repas, programmeId, description, ingredients } = req.body;
    
    // Convertir les ingrédients en tableau s'ils sont fournis en format JSON
    let ingredientsArray = [];
    if (ingredients) {
      ingredientsArray = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
    }
    
    const newNutrition = new Nutrition({
      nom_plat,
      calories: parseInt(calories),
      repas,
      programmeId,
      description,
      ingredients: ingredientsArray,
      image_path: req.file ? req.file.filename : null
    });
    
    const savedNutrition = await newNutrition.save();
    res.status(201).json(savedNutrition);
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'élément nutrition :", error);
    res.status(500).send("Erreur lors de l'ajout de l'élément nutrition.");
  }
});

// API pour modifier un élément nutrition
router.put('/nutrition/:id', upload.single('image_file'), async (req, res) => {
  try {
    const { nom_plat, calories, repas, programmeId, description, ingredients } = req.body;
    
    // Convertir les ingrédients en tableau s'ils sont fournis en format JSON
    let ingredientsArray = [];
    if (ingredients) {
      ingredientsArray = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
    }
    
    const updateData = {
      nom_plat,
      calories: parseInt(calories),
      repas,
      programmeId,
      description,
      ingredients: ingredientsArray
    };
    
    // Ajouter le chemin de l'image si une nouvelle image est fournie
    if (req.file) {
      updateData.image_path = req.file.filename;
    }
    
    const updatedNutrition = await Nutrition.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!updatedNutrition) {
      return res.status(404).send("Élément nutrition non trouvé");
    }
    
    res.json(updatedNutrition);
  } catch (error) {
    console.error("Erreur lors de la modification de l'élément nutrition :", error);
    res.status(500).send("Erreur lors de la modification de l'élément nutrition.");
  }
});

// API pour supprimer un élément nutrition
router.delete('/nutrition/:id', async (req, res) => {
  try {
    const deletedNutrition = await Nutrition.findByIdAndDelete(req.params.id);
    if (!deletedNutrition) {
      return res.status(404).send("Élément nutrition non trouvé");
    }
    res.status(200).send("Élément nutrition supprimé avec succès.");
  } catch (error) {
    console.error("Erreur lors de la suppression de l'élément nutrition :", error);
    res.status(500).send("Erreur lors de la suppression de l'élément nutrition.");
  }
});
// API pour récupérer les éléments nutrition par programmeId
router.get('/nutrition/programme/:programmeId', async (req, res) => {
  try {
    const nutritions = await Nutrition.find({ programmeId: req.params.programmeId })
                                      .populate('programmeId', 'nom');
    res.json(nutritions);
  } catch (error) {
    console.error("Erreur lors de la récupération des éléments nutrition par programmeId :", error);
    res.status(500).send("Erreur lors de la récupération des éléments nutrition.");
  }
});

module.exports = router;