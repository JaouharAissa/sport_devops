const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NutritionSchema = new Schema({
  nom_plat: {
    type: String,
    required: true
  },
  image_path: {
    type: String,
    default: null
  },
  calories: {
    type: Number,
    required: true
  },
  repas: {
    type: String,
    enum: ['petitdejeuner', 'dejeuner', 'diner'],
    required: true
  },
  programmeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Programme',
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  ingredients: {
    type: [String],
    default: []
  }
});

const Nutrition = mongoose.model('Nutrition', NutritionSchema);

module.exports = Nutrition;