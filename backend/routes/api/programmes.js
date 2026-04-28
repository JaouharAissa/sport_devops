// // routes/programmes.js
// const express = require('express');
// const Programme = require('../../models/Programme');

// const router = express.Router();

// // Récupérer tous les programmes
// router.get('/', async (req, res) => {
//   try {
//     const programmes = await Programme.find();
//     res.json(programmes);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Ajouter un nouveau programme
// router.post('/', async (req, res) => {
//   const { nom, description, conditions } = req.body;

//   const newProgramme = new Programme({
//     nom,
//     description,
//     conditions
//   });

//   try {
//     await newProgramme.save();
//     res.status(201).json(newProgramme);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Modifier un programme existant
// router.put('/:id', async (req, res) => {
//   try {
//     const programme = await Programme.findById(req.params.id);

//     programme.nom = req.body.nom || programme.nom;
//     programme.description = req.body.description || programme.description;
//     programme.conditions = req.body.conditions || programme.conditions;

//     await programme.save();
//     res.json(programme);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Supprimer un programme
// router.delete('/:id', async (req, res) => {
//   try {
//     await Programme.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Programme supprimé avec succès' });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// module.exports = router;
