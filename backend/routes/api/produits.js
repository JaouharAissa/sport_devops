const router = require("express").Router();
const config = require("config");
const Produit = require("../../models/Produit");
// @route POST api/users
// @desc Register new user
// @access Public
router.post("/add", (req, res) => {
    // Destructure required fields from req.body
    const { libelle, quantite, dateexpiration } = req.body;
    // Check if any required fields are missing
    if (!libelle || !quantite || !dateexpiration) {
    return res.status(400).send({ status: "notok", msg: "Please enter all     required data" });
    }

// Create a new user instance
const newProduit = new Produit({
    libelle,
    quantite,
    dateexpiration
});


   
  
// Save the user to the database
newProduit.save()
.then((newProduit) => {

// Send response with token and user details
res.status(200).send({ status: "ok", msg: "Successfully created", newProduit });
}
);
})


   

      
    // Lire tous les utilisateurs (READ)
router.get('/all', async (req, res) => {
    try {
    const produits = await Produit.find();
    res.status(200).json(produits);
    } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des produits', error });
    }
    });
    // Lire un utilisateur par ID (READ)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
    const produits = await Produit.findById(id);
    if (!produits) {
    return res.status(404).json({ message: 'produit non trouvé' });
    }
    res.status(200).json(produits);
    } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de produit', error });
    }
    });
    // Mettre à jour un utilisateur par ID (UPDATE)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { libelle, quantite, dateexpiration } = req.body;
    try {
    const updatedProduit = await Produit.findByIdAndUpdate(
    id,
    { libelle, quantite, dateexpiration },
    { new: true }
    );
    if (!updatedProduit) {
    return res.status(404).json({ message: 'produit non trouvé' });
    }
    res.status(200).json({ message: 'produit mis à jour avec succès',
    updatedProduit });
    } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de produit', error });
    }
    });
    // Supprimer un utilisateur par ID (DELETE)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
    const deletedProduit = await Produit.findByIdAndDelete(id);
    if (!deletedProduit) {
    return res.status(404).json({ message: 'produit non trouvé' });
    }
    res.status(200).json({ message: 'produit supprimé avec succès' });
    } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de produit', error });
    }
    });
    module.exports = router;