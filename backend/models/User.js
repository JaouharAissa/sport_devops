const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Informations de base
  username: {
    type: String,
    required: [true, 'Le nom d\'utilisateur est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email non valide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  // Données du formulaire complémentaire
  profile: {
    age: {
      type: Number,
      min: [15, 'L\'âge minimum est 15'],
      max: [100, 'L\'âge maximum est 100']
    },
    weight: { // en kg
      type: Number,
      min: [30, 'Le poids minimum est 30kg'],
      max: [200, 'Le poids maximum est 200kg']
    },
    height: { // en cm
      type: Number,
      min: [100, 'La taille minimum est 100cm'],
      max: [250, 'La taille maximum est 250cm']
    },
    imc: { // IMC - Indice de Masse Corporelle
      type: String, // Stocké en tant que chaîne pour garder 2 décimales
      // L'IMC peut être calculé et mis à jour plus tard, il n'est pas requis lors de la création
    },
    sportDemotivation: {
      type: String,
      enum: ['Manque de temps', 'Manque de résultats', 'Douleurs', 'Manque de motivation']
    },
    sleepHours: {
      type: String,
      enum: ['Moins de 6h', '6h-8h', 'Plus de 8h']
    },
    stressLevel: {
      type: String,
      enum: ['Faible', 'Moyen', 'Élevé']
    },
    badHabits: {
      type: String,
      enum: ['Oui', 'Non']
    }
  },
    programmeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Programme'
  },
  progression: {
    joursTermines: [Number], // Jours terminés par l'utilisateur (1-7)
    dernierJour: { type: Number, default: 1 }, // Dernier jour accessible
    jourActuel: { type: Number, default: 1 }, // Jour actuel de l'utilisateur
    exercicesTermines: [mongoose.Schema.Types.ObjectId] // IDs des exercices terminés
  }
}, { timestamps: true });

// Hachage du mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);
