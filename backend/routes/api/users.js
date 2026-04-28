const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../../models/User");
const Programme = require('../../models/Programme');
const Exercice = require('../../models/Exercice');
const Conseil = require('../../models/Conseil');
const Nutrition = require('../../models/Nutrition');

const ProgrammeExercice = require('../../models/ProgrammeExercice');
const auth = require('../../middleware/auth');
// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'votre_clé_secrète_par_défaut';

// Route d'inscription (Register)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation simple côté serveur
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis'
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Créer un nouvel utilisateur
    const user = new User({
      username,
      email,
      password // Le middleware pre('save') va hasher le mot de passe
    });

    // Sauvegarder l'utilisateur
    await user.save();

    // Retourner la réponse sans le mot de passe
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      user: userResponse,
      message: 'Inscription réussie!'
    });

  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    
    // Gestion des erreurs de validation Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'inscription'
    });
  }
});

// Route de connexion (Login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Vérification que tous les champs sont remplis
    if (!email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Vérification pour l'admin fixe
    if (email === 'admin@gmail.com' && password === 'admin') {
      const token = jwt.sign(
        { role: 'admin' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      return res.json({
        success: true,
        token,
        role: 'admin',
        message: 'Connexion admin réussie'
      });
    }

    // Pour les utilisateurs normaux
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Création du token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Réponse sans le mot de passe
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      token,
      user: userResponse,
      role: user.role,
      message: 'Connexion réussie'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Compléter le profil utilisateur
router.put('/complete-profile/:userId', async (req, res) => {
  try {
    const { age, weight, height, motivation, sleepHours, stressLevel, badHabits } = req.body;
    const userId = req.params.userId;

    // Calcul de l'IMC
    const imc = (weight / ((height / 100) ** 2)).toFixed(2);
    console.log('IMC calculé :', imc);
    
    // Déterminer le programme en fonction de l'IMC
    const programmeId = await getProgrammeByIMC(imc);

    // Mise à jour du profil avec l'IMC et le programme
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'profile.age': age,
          'profile.weight': weight,
          'profile.height': height,
          'profile.sportDemotivation': motivation,
          'profile.sleepHours': sleepHours,
          'profile.stressLevel': stressLevel,
          'profile.badHabits': badHabits,
          'profile.imc': imc,
          programmeId: programmeId,
          progression: {
            joursTermines: [],
            dernierJour: 1,
            jourActuel: 1,
            exercicesTermines: []
          }
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user: updatedUser,
      message: 'Profil complété avec succès'
    });

  } catch (error) {
    console.error('Erreur:', error);
    // Gestion des erreurs...
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});
// Ajouter cette fonction pour déterminer le programme en fonction de l'IMC
const getProgrammeByIMC = async (imc) => {
  let programmeNom;
  
  if (imc < 18.5) {
    programmeNom = 'mince';
  } else if (imc >= 18.5 && imc < 25) {
    programmeNom = 'normal';
  } else {
    programmeNom = 'gros';
  }
  
  // Trouver l'ID du programme correspondant
  const programme = await Programme.findOne({ nom: programmeNom });
  return programme ? programme._id : null;
};
// Nouvelle route pour récupérer les exercices du programme de l'utilisateur
// Route pour récupérer les exercices du programme de l'utilisateur
router.post('/user/programme', async (req, res) => {
  try {
    const { userId, jour } = req.body;
    const jourDemande = parseInt(jour);
    
    // Vérifier si userId existe
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId est requis'
      });
    }
    
    // Récupérer l'utilisateur avec son programme
    const user = await User.findById(userId);
    if (!user || !user.programmeId) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur ou programme non trouvé' 
      });
    }

    // DÉBLOCAGE AUTOMATIQUE: Si les jours 1 et 2 sont terminés, on débloque automatiquement le jour 4
    if (user.progression.joursTermines.includes(1) && 
        user.progression.joursTermines.includes(2)) {
      
      // Marquer le jour 3 (repos) comme terminé s'il ne l'est pas déjà
      if (!user.progression.joursTermines.includes(3)) {
        user.progression.joursTermines.push(3);
      }
      
      // S'assurer que le jour 4 est débloqué
      if (user.progression.dernierJour < 4) {
        user.progression.dernierJour = 4;
        // Sauvegarder les modifications
        await user.save();
      }
    }

    // Vérifier si le jour demandé est accessible (après le déblocage automatique)
    if (jourDemande > user.progression.dernierJour) {
      return res.status(403).json({
        success: false,
        message: 'Ce jour n\'est pas encore débloqué'
      });
    }

    // Trouver les exercices du programme pour ce jour
    const programmeExercices = await ProgrammeExercice.find({ programmeId: user.programmeId });
    const exerciceIds = programmeExercices.map(pe => pe.exerciceId);
    
    const exercices = await Exercice.find({
      _id: { $in: exerciceIds },
      jour: jourDemande
    }).populate('conseilId');

    res.json({
      success: true,
      exercices,
      progression: user.progression
    });
    
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Route pour marquer un exercice comme terminé
router.post('/user/exercice/terminer', async (req, res) => {
  try {
    const { userId, exerciceId } = req.body;
    
    if (!userId || !exerciceId) {
      return res.status(400).json({
        success: false,
        message: 'userId et exerciceId sont requis'
      });
    }
    
    // Récupérer l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    
    // Récupérer l'exercice pour connaître son jour
    const exercice = await Exercice.findById(exerciceId);
    if (!exercice) {
      return res.status(404).json({ success: false, message: 'Exercice non trouvé' });
    }
    
    const jourExercice = exercice.jour;
    
    // Vérifier si l'exercice est déjà marqué comme terminé
    if (user.progression.exercicesTermines.includes(exerciceId)) {
      return res.json({
        success: true,
        progression: user.progression,
        message: 'Exercice déjà terminé'
      });
    }
    
    // Ajouter l'exercice à la liste des exercices terminés
    user.progression.exercicesTermines.push(exerciceId);
    
    // Vérifier si tous les exercices du jour sont terminés
    const programmeExercices = await ProgrammeExercice.find({ programmeId: user.programmeId });
    const exerciceIds = programmeExercices.map(pe => pe.exerciceId);
    
    const exercicesDuJour = await Exercice.find({
      _id: { $in: exerciceIds },
      jour: jourExercice
    });
    
    const exercicesIdsJour = exercicesDuJour.map(ex => ex._id.toString());
    const exercicesTerminesJour = user.progression.exercicesTermines
      .filter(exId => exercicesIdsJour.includes(exId.toString()));
    
    // Si tous les exercices du jour sont terminés
    if (exercicesTerminesJour.length === exercicesDuJour.length) {
      // Marquer le jour comme terminé s'il ne l'est pas déjà
      if (!user.progression.joursTermines.includes(jourExercice)) {
        user.progression.joursTermines.push(jourExercice);
      }
      
      // Mettre à jour le jourActuel
      user.progression.jourActuel = jourExercice;
      
      // Vérifier si le programme complet est terminé (tous les 7 jours)
      if (jourExercice === 7) {
        // Réinitialiser le programme après avoir terminé les 7 jours
        user.progression = {
          joursTermines: [],
          dernierJour: 1,
          jourActuel: 1,
          exercicesTermines: []
        };
        
        await user.save();
        
        // Retourner une réponse spéciale indiquant que le programme est terminé
        return res.json({
          success: true,
          progression: user.progression,
          programmeTermine: true,
          message: 'Félicitations! Vous avez terminé le programme de 7 jours.'
        });
      }
      
      // Débloquer le jour suivant si ce n'est pas le dernier jour (7)
      if (jourExercice < 7 && user.progression.dernierJour <= jourExercice) {
        user.progression.dernierJour = jourExercice + 1;
        
        // Si on vient de terminer le jour 2, on traite spécialement le jour 3 (repos)
        if (jourExercice === 2) {
          // Marquer le jour 3 comme terminé s'il ne l'est pas déjà
          if (!user.progression.joursTermines.includes(3)) {
            user.progression.joursTermines.push(3);
          }
          
          // Et on débloque directement le jour 4
          user.progression.dernierJour = 4;
        }
      }
    }
    
    // Pour la sécurité: vérifier si les jours 1 et 2 sont terminés mais que le jour 4 n'est pas débloqué
    if (user.progression.joursTermines.includes(1) && 
        user.progression.joursTermines.includes(2) && 
        user.progression.dernierJour < 4) {
      
      // Marquer le jour 3 (repos) comme terminé
      if (!user.progression.joursTermines.includes(3)) {
        user.progression.joursTermines.push(3);
      }
      
      // Débloquer le jour 4
      user.progression.dernierJour = 4;
    }
    
    // Sauvegarder les modifications
    await user.save();
    
    res.json({
      success: true,
      progression: user.progression,
      message: 'Exercice marqué comme terminé'
    });
    
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});
// Ajouter cette route dans le fichier users.js
router.post('/user/nutrition', async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Vérifier si userId existe
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId est requis'
      });
    }
    
    // Récupérer l'utilisateur avec son programme
    const user = await User.findById(userId);
    if (!user || !user.programmeId) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur ou programme non trouvé'
      });
    }
    
    // Récupérer les nutritions correspondant au programme de l'utilisateur
    const nutritions = await Nutrition.find({ programmeId: user.programmeId })
                                    .populate('programmeId', 'nom');
    
    res.json({
      success: true,
      nutritions,
      programme: {
        id: user.programmeId,
        nom: nutritions.length > 0 ? nutritions[0].programmeId.nom : null
      }
    });
    
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});
module.exports = router;