const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProgrammeSchema = new Schema({
  nom: {
    type: String,
    required: true,
    unique: true
  }
});

const Programme = mongoose.model('Programme', ProgrammeSchema);

// Initialisation automatique des programmes fixes
const initialProgrammes = ['mince', 'normal', 'gros'];

async function initProgrammes() {
  try {
    const count = await Programme.countDocuments();
    if (count === 0) {
      await Programme.insertMany(initialProgrammes.map(nom => ({ nom })));
      console.log('✅ Programmes par défaut insérés dans la base.');
    }
  } catch (err) {
    console.error('❌ Erreur lors de l\'initialisation des programmes :', err);
  }
}

// Lancer l'initialisation quand le modèle est chargé
initProgrammes();

module.exports = Programme;
 