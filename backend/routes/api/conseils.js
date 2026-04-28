// // routes/conseils.js
// const express = require('express');
// const Conseil = require('../../models/Conseil');

// const router = express.Router();

// // Récupérer tous les conseils
// router.get('/', async (req, res) => {
//   try {
//     const conseils = await Conseil.find();
//     res.json(conseils);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Ajouter un nouveau conseil
// router.post('/', async (req, res) => {
//   const { titre, description } = req.body;

//   const newConseil = new Conseil({
//     titre,
//     description
//   });

//   try {
//     await newConseil.save();
//     res.status(201).json(newConseil);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Modifier un conseil existant
// router.put('/:id', async (req, res) => {
//   try {
//     const conseil = await Conseil.findById(req.params.id);

//     conseil.titre = req.body.titre || conseil.titre;
//     conseil.description = req.body.description || conseil.description;

//     await conseil.save();
//     res.json(conseil);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Supprimer un conseil
// router.delete('/:id', async (req, res) => {
//   try {
//     await Conseil.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Conseil supprimé avec succès' });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// module.exports = router;
