const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Définition du modèle Conseil
const ConseilSchema = new Schema({
  texte: {
    type: String,
    required: true
  }
});

// Créer un modèle à partir du schéma
module.exports = mongoose.model('Conseil', ConseilSchema);
