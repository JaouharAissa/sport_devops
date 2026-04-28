const mongoose= require('mongoose'); // Définir le schéma utilisateur
const ProduitSchema= new mongoose.Schema({ 
libelle: { 
    type: String,
     required: true, },
quantite: {
     type: Number,
    required: true,
    
    },
 dateexpiration: { 
    type: Date,
     required: true, // Le mot de passe est requis 
     }
 });
  // Créer un modèle basé sur ce schéma 
  const Produit = mongoose.model('Produit', ProduitSchema);
   module.exports= Produit;