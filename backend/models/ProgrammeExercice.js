const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProgrammeExerciceSchema = new Schema({
  programmeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Programme',
    required: true
  },
  exerciceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercice',
    required: true
  }
});

module.exports = mongoose.model('ProgrammeExercice', ProgrammeExerciceSchema);
