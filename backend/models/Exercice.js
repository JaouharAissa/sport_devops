const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciceSchema = new Schema({
  nom: { type: String, required: true },
  description: { type: String, required: true },
  gif_path: { type: String },
  conseilId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conseil' },
  jour: { type: Number, min: 1, max: 7, required: true }, // Jour du programme
  timer: { type: Number, default: 20 } // Durée en secondes
});

module.exports = mongoose.model('Exercice', ExerciceSchema);
