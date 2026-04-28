const jwt = require('jsonwebtoken');
const config = require('config'); // <--- Ajoute cette ligne

const auth = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Accès refusé. Aucun token fourni.' });
  }

  try {
    const jwtSecret = config.get('jwtSecret'); // <--- Récupère depuis default.json
    const decoded = jwt.verify(token, jwtSecret); // utilise la clé

    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: 'Token invalide.' });
  }
};

module.exports = auth;
