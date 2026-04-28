// // routes/exercices.js
// const express = require('express');
// const multer = require('multer');
// const Exercice = require('../../models/Exercice');

// const router = express.Router();

// // Configuration de multer pour l'upload de GIFs
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// // Récupérer tous les exercices
// router.get('/', async (req, res) => {
//   try {
//     const exercices = await Exercice.find();
//     res.json(exercices);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Ajouter un nouvel exercice
// router.post('/', upload.single('gif'), async (req, res) => {
//   const { nom, description, conseilId, programmes } = req.body;
//   const gif = req.file ? req.file.path : null;

//   const newExercice = new Exercice({
//     nom,
//     description,
//     conseilId,
//     programmes: JSON.parse(programmes),
//     gif
//   });

//   try {
//     await newExercice.save();
//     res.status(201).json(newExercice);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Modifier un exercice existant
// router.put('/:id', upload.single('gif'), async (req, res) => {
//   try {
//     const exercice = await Exercice.findById(req.params.id);

//     if (req.body.nom) exercice.nom = req.body.nom;
//     if (req.body.description) exercice.description = req.body.description;
//     if (req.body.conseilId) exercice.conseilId = req.body.conseilId;
//     if (req.body.programmes) exercice.programmes = JSON.parse(req.body.programmes);
//     if (req.file) exercice.gif = req.file.path;

//     await exercice.save();
//     res.json(exercice);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Supprimer un exercice
// router.delete('/:id', async (req, res) => {
//   try {
//     await Exercice.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Exercice supprimé avec succès' });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// module.exports = router;
